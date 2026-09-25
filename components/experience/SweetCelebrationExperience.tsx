"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Heart, Mail, X, Sparkles, PartyPopper } from "lucide-react";
import styles from "./SweetCelebration.module.css";
import { soundManager } from "@/lib/audio/soundManager";

export interface SweetCelebrationExperienceProps {
  recipientName?: string;
  senderName?: string;
  specialDate?: string;
  message?: string;
  photos?: string[];
  onFinish?: () => void;
}

export function SweetCelebrationExperience({
  recipientName = "Hayati",
  senderName = "",
  specialDate = "23 May 2005",
  message = "You are a very special person. Today, I wish you all the best, lots of health, and lots of joy. I always hope we will celebrate many more birthdays like this together. Happy birthday to you! 💕",
  photos = [],
  onFinish,
}: SweetCelebrationExperienceProps) {
  // Recipient photo fallback
  const recipientPhoto =
    photos.length > 0 && photos[0]
      ? photos[0]
      : "/templates/sweet-celebration/r5.jpg";

  // State
  const [typedDate, setTypedDate] = useState("");
  const [isDateComplete, setIsDateComplete] = useState(false);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [typedTitle, setTypedTitle] = useState("");
  const [typedMessage, setTypedMessage] = useState("");
  const [hasStartedLetterTyping, setHasStartedLetterTyping] = useState(false);
  const [showAnimations, setShowAnimations] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Date formatting helper: 2005-05-23 -> 23 May 2005
  const formattedSpecialDate = React.useMemo(() => {
    if (!specialDate) return "23 May 2005";
    const isoMatch = specialDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) {
      const year = isoMatch[1];
      const monthIdx = parseInt(isoMatch[2], 10) - 1;
      const day = parseInt(isoMatch[3], 10);
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return `${day} ${months[monthIdx] || ""} ${year}`;
    }
    return specialDate;
  }, [specialDate]);

  // 1. Date of birth typing effect
  useEffect(() => {
    let dateTimer: NodeJS.Timeout;
    let charIndex = 0;
    const dateChars = formattedSpecialDate.split("");

    // Start typing date after flag and title animations land (~2.2s)
    const initialDelay = setTimeout(() => {
      dateTimer = setInterval(() => {
        if (charIndex < dateChars.length) {
          setTypedDate((prev) => prev + dateChars[charIndex]);
          charIndex++;
        } else {
          setIsDateComplete(true);
          clearInterval(dateTimer);
        }
      }, 70);
    }, 2200);

    return () => {
      clearTimeout(initialDelay);
      if (dateTimer) clearInterval(dateTimer);
    };
  }, [formattedSpecialDate]);

  // 2. Interactive Floating Heart Cursor Trail
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const colors = ["#ff3366", "#ff6699", "#ff33cc", "#ff99cc", "#ff66b2", "#ff0066"];
    let lastSpawn = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastSpawn < 45) return; // Throttle particle creation
      lastSpawn = now;

      const heart = document.createElement("span");
      const size = Math.floor(Math.random() * 14) + 14;
      const color = colors[Math.floor(Math.random() * colors.length)];

      heart.innerText = "♥";
      heart.style.position = "fixed";
      heart.style.left = `${e.clientX - size / 2}px`;
      heart.style.top = `${e.clientY - size}px`;
      heart.style.fontSize = `${size}px`;
      heart.style.color = color;
      heart.style.pointerEvents = "none";
      heart.style.zIndex = "9998";
      heart.style.opacity = "0.85";
      heart.style.transition = "transform 1s cubic-bezier(0, .8, .2, 1), opacity 1s ease-out";
      heart.style.transform = "translateY(0) scale(1)";

      document.body.appendChild(heart);

      requestAnimationFrame(() => {
        const driftX = (Math.random() - 0.5) * 40;
        const driftY = -(Math.random() * 70 + 40);
        heart.style.transform = `translate(${driftX}px, ${driftY}px) scale(${Math.random() * 0.4 + 0.8})`;
        heart.style.opacity = "0";
      });

      setTimeout(() => {
        if (heart.parentNode) heart.parentNode.removeChild(heart);
      }, 1000);
    };

    container.addEventListener("pointermove", handlePointerMove);

    return () => {
      container.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  // 3. Open Letter Box & Typewriter Choreography
  const handleOpenLetter = useCallback(() => {
    soundManager.playSoundEffect("pop");
    setIsLetterOpen(true);
    setTypedTitle("");
    setTypedMessage("");
    setHasStartedLetterTyping(false);
    setShowAnimations(false);

    // Title typing after letter modal settles (~800ms)
    const titleText = `To ${recipientName || "you"} ❤️`;
    const titleChars = titleText.split("");
    let titleIdx = 0;

    setTimeout(() => {
      const titleInterval = setInterval(() => {
        if (titleIdx < titleChars.length) {
          setTypedTitle((prev) => prev + titleChars[titleIdx]);
          titleIdx++;
        } else {
          clearInterval(titleInterval);
          setShowAnimations(true);
          setHasStartedLetterTyping(true);
        }
      }, 80);
    }, 600);
  }, [recipientName]);

  // 4. Letter Body Typewriter
  useEffect(() => {
    if (!hasStartedLetterTyping) return;

    let bodyInterval: NodeJS.Timeout;
    const bodyChars = message.split("");
    let bodyIdx = 0;

    const startBodyDelay = setTimeout(() => {
      bodyInterval = setInterval(() => {
        if (bodyIdx < bodyChars.length) {
          setTypedMessage((prev) => prev + bodyChars[bodyIdx]);
          bodyIdx++;
        } else {
          clearInterval(bodyInterval);
        }
      }, 35);
    }, 400);

    return () => {
      clearTimeout(startBodyDelay);
      if (bodyInterval) clearInterval(bodyInterval);
    };
  }, [hasStartedLetterTyping, message]);

  // 5. Close Letter Box
  const handleCloseLetter = useCallback(() => {
    soundManager.playSoundEffect("pop");
    setIsLetterOpen(false);
  }, []);

  // Fast-Forward / Skip directly to all elements loaded
  const handleFastForward = useCallback(() => {
    setTypedDate(formattedSpecialDate);
    setIsDateComplete(true);
  }, [formattedSpecialDate]);

  return (
    <div ref={containerRef} className={styles.wrapper}>
      {/* 1. Birthday Bunting Flags */}
      <div className={styles.flagBirthday}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/templates/sweet-celebration/1.png"
          alt="Bunting Flag"
          width={350}
          className={styles.flagLeft}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/templates/sweet-celebration/1.png"
          alt="Bunting Flag"
          width={350}
          className={styles.flagRight}
        />
      </div>

      {/* 2. Main Stage Content */}
      <div className={styles.content}>
        {/* Left Side: Staggered "Happy Birthday" text + Hat + Date + Open Button */}
        <div className={styles.left}>
          <div className={styles.title}>
            <h1 className={styles.happy}>
              <span style={{ "--t": "0.3s" } as React.CSSProperties}>H</span>
              <span style={{ "--t": "0.4s" } as React.CSSProperties}>a</span>
              <span style={{ "--t": "0.5s" } as React.CSSProperties}>p</span>
              <span style={{ "--t": "0.6s" } as React.CSSProperties}>p</span>
              <span className={styles.letterYAnchor} style={{ "--t": "0.7s" } as React.CSSProperties}>
                y
                {/* Birthday Hat perched on Y */}
                <div className={styles.hat}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/templates/sweet-celebration/hat.png"
                    alt="Party Hat"
                    width={85}
                  />
                </div>
              </span>
            </h1>
            <h1 className={styles.birthday}>
              <span style={{ "--t": "0.8s" } as React.CSSProperties}>B</span>
              <span style={{ "--t": "0.9s" } as React.CSSProperties}>i</span>
              <span style={{ "--t": "1.0s" } as React.CSSProperties}>r</span>
              <span style={{ "--t": "1.1s" } as React.CSSProperties}>t</span>
              <span style={{ "--t": "1.2s" } as React.CSSProperties}>h</span>
              <span style={{ "--t": "1.3s" } as React.CSSProperties}>d</span>
              <span style={{ "--t": "1.4s" } as React.CSSProperties}>a</span>
              <span style={{ "--t": "1.5s" } as React.CSSProperties}>y</span>
            </h1>
          </div>

          {/* Date of Birth Badge with Typewriter Effect */}
          <div className={styles.dateOfBirth}>
            {isDateComplete && <span className="text-amber-300">★ </span>}
            <span>{typedDate}</span>
            {isDateComplete && <span className="text-amber-300"> ★</span>}
          </div>

          {/* Click Here Button */}
          <div className={styles.btnContainer}>
            <button
              id="btn__letter"
              className={styles.btnLetter}
              onClick={handleOpenLetter}
              aria-label="Open Birthday Letter"
            >
              <span>Click here</span>
              <Mail className="w-4 h-4 text-rose-600" />
            </button>
          </div>
        </div>

        {/* Right Side: Photo Frame + Name + Balloons + Spinning Text Badge */}
        <div className={styles.right}>
          <div className={styles.boxAccount}>
            {/* Recipient Photo Frame */}
            <div className={styles.imageCircle}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={recipientPhoto}
                alt={recipientName}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/templates/sweet-celebration/r5.jpg";
                }}
              />
            </div>

            {/* Recipient Name Pill */}
            <div className={styles.nameBadge}>
              <Heart className="w-5 h-5 fill-rose-600 text-rose-600 animate-pulse" />
              <span>{recipientName}</span>
              <Heart className="w-5 h-5 fill-rose-600 text-rose-600 animate-pulse" />
            </div>

            {/* Left Balloon Cluster */}
            <div className={styles.balloonOne}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                width={100}
                src="/templates/sweet-celebration/balloon1.png"
                alt="Balloon"
              />
            </div>

            {/* Right Balloon Cluster */}
            <div className={styles.balloonTwo}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                width={100}
                src="/templates/sweet-celebration/balloon2.png"
                alt="Balloon"
              />
            </div>
          </div>

          {/* Spinning Circular "Happy Birthday" Text Badge */}
          <div className={styles.circleBadge}>
            <div className={styles.textCircle}>
              {"happy-birthday-".split("").map((char, idx) => (
                <span
                  key={idx}
                  style={{ "--i": idx + 1 } as React.CSSProperties}
                >
                  {char}
                </span>
              ))}
            </div>
            <Heart className={`w-5 h-5 ${styles.circleBadgeIcon}`} fill="#F61F1F" />
          </div>
        </div>
      </div>

      {/* Decorative Floating Stars */}
      <div className={`${styles.decorateStar} ${styles.star1}`} style={{ "--t": "8s" } as React.CSSProperties} />
      <div className={`${styles.decorateStar} ${styles.star2}`} style={{ "--t": "8.2s" } as React.CSSProperties} />
      <div className={`${styles.decorateStar} ${styles.star3}`} style={{ "--t": "8.4s" } as React.CSSProperties} />
      <div className={`${styles.decorateStar} ${styles.star4}`} style={{ "--t": "8.6s" } as React.CSSProperties} />
      <div className={`${styles.decorateStar} ${styles.star5}`} style={{ "--t": "8.8s" } as React.CSSProperties} />

      {/* Decorative Flowers */}
      <div className={styles.flowerOne} style={{ "--t": "8.2s" } as React.CSSProperties}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img width={20} src="/templates/sweet-celebration/decorate_flower.png" alt="Flower" />
      </div>
      <div className={styles.flowerTwo} style={{ "--t": "8.5s" } as React.CSSProperties}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img width={20} src="/templates/sweet-celebration/decorate_flower.png" alt="Flower" />
      </div>
      <div className={styles.flowerThree} style={{ "--t": "8.8s" } as React.CSSProperties}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img width={20} src="/templates/sweet-celebration/decorate_flower.png" alt="Flower" />
      </div>

      {/* Decorative Bottom Ribbon & Smiley */}
      <div className={styles.decorateBottom}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/templates/sweet-celebration/decorate.png" alt="Decoration" width={100} />
      </div>
      <div className={styles.smileyIcon}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/templates/sweet-celebration/smiley_icon.png" alt="Smiley" width={90} />
      </div>

      {/* 3. Interactive Letter Box Modal */}
      {isLetterOpen && (
        <div className={styles.boxLetter}>
          <div className={styles.letterBorder}>
            {/* Close Button */}
            <button
              className={styles.letterCloseBtn}
              onClick={handleCloseLetter}
              aria-label="Close Letter"
            >
              <X className="w-5 h-5" />
            </button>

            <div className={styles.letterInner}>
              {/* Typewriter Title */}
              <div className={styles.titleLetter}>
                <span>{typedTitle}</span>
              </div>

              {/* Letter Content Columns */}
              <div className={styles.contentLetter}>
                {/* Left Column: Heart GIF & Floating Hearts */}
                <div className={styles.letterLeft}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    id="heartLetter"
                    src="/templates/sweet-celebration/heart_animated.gif"
                    alt="Animated Pulsing Heart"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/templates/sweet-celebration/heart_letter.png";
                    }}
                  />
                  {showAnimations && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className={`${styles.letterHeartParticle} ${styles.heart1}`} width={20} src="/templates/sweet-celebration/heart.png" alt="" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className={`${styles.letterHeartParticle} ${styles.heart2}`} width={20} src="/templates/sweet-celebration/heart.png" alt="" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className={`${styles.letterHeartParticle} ${styles.heart3}`} width={20} src="/templates/sweet-celebration/heart.png" alt="" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className={`${styles.letterHeartParticle} ${styles.heart4}`} width={20} src="/templates/sweet-celebration/heart.png" alt="" />
                    </>
                  )}
                </div>

                {/* Right Column: Love GIF + Typewriter Message + Mewmew Cat GIF */}
                <div className={styles.letterRight}>
                  {showAnimations && (
                    <div className={styles.loveImg}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/templates/sweet-celebration/love_animated.gif"
                        alt="Animated Love Art"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/templates/sweet-celebration/love.png";
                        }}
                      />
                    </div>
                  )}

                  <div className={styles.textLetter}>
                    <p>{typedMessage}</p>
                    {senderName && hasStartedLetterTyping && (
                      <p className="mt-4 text-right font-bold text-rose-500">
                        — With all my love, {senderName} 💕
                      </p>
                    )}
                  </div>

                  {showAnimations && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      className={styles.mewmewImg}
                      src="/templates/sweet-celebration/mewmew.gif"
                      alt="Cute Mewmew Cat"
                    />
                  )}
                </div>
              </div>

              {/* Letter Footer CTA: Continue to celebration finale */}
              {onFinish && (
                <div className="mt-4 pt-3 border-t border-amber-200/60 flex justify-end">
                  <button
                    onClick={onFinish}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm shadow-md hover:shadow-lg hover:from-pink-600 hover:to-rose-600 transition-all cursor-pointer"
                  >
                    <PartyPopper className="w-4 h-4 text-amber-200" />
                    <span>Celebrate with {recipientName}!</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Helper Bar: Skip / Celebrate Controls */}
      <div className={styles.skipBar}>
        {!isDateComplete && (
          <button
            onClick={handleFastForward}
            className={styles.skipBtn}
            title="Skip directly to ready state"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500 inline mr-1" />
            Fast-Forward
          </button>
        )}
        {onFinish && (
          <button
            onClick={onFinish}
            className={styles.skipBtn}
            title="View recipient final screen"
          >
            <PartyPopper className="w-3.5 h-3.5 text-purple-500 inline mr-1" />
            Finish & Celebrate
          </button>
        )}
      </div>
    </div>
  );
}
