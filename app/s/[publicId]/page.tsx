import React from "react";
import { Metadata } from "next";
import { SAMPLE_SURPRISE } from "@/lib/constants";
import { templateRegistry } from "@/lib/engine/templateRegistry";
import { SurpriseModel, PersonalizationData } from "@/lib/engine/types";
import { PublicSurpriseClient } from "@/components/experience/PublicSurpriseClient";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ publicId: string }>;
  searchParams?: Promise<{
    name?: string;
    sender?: string;
    template?: string;
    message?: string;
  }>;
}): Promise<Metadata> {
  const { publicId } = await params;
  const query = searchParams ? await searchParams : {};
  const isSample = publicId === SAMPLE_SURPRISE.publicId;

  let cloudRecord: any = null;
  if (!isSample) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("published_surprises")
        .select("template_slug, recipient_name, sender_name")
        .eq("public_id", publicId)
        .maybeSingle();
      cloudRecord = data;
    } catch {
      // ignore
    }
  }

  const templateSlug =
    cloudRecord?.template_slug ||
    query.template ||
    (publicId.includes("golden") || publicId.includes("proposal") || publicId.startsWith("love-")
      ? "the-golden-proposal"
      : "sweet-celebration");

  const recipientName =
    cloudRecord?.recipient_name ||
    query.name ||
    (isSample ? SAMPLE_SURPRISE.recipient.name : "Someone Special");

  const senderName =
    cloudRecord?.sender_name ||
    query.sender ||
    (isSample ? SAMPLE_SURPRISE.sender.name : "");

  const isProposal = templateSlug === "the-golden-proposal";

  const title = isProposal
    ? "💍 Someone has a special question for you..."
    : "🎁 Someone has a surprise for you!";

  const description = isProposal
    ? `Open your romantic proposal surprise ${senderName ? `from ${senderName}` : ""} 💕`
    : "Open your special celebration surprise ✨";

  const ogImageUrl = `/api/og?name=${encodeURIComponent(recipientName)}${
    senderName ? `&sender=${encodeURIComponent(senderName)}` : ""
  }`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Special Surprise for ${recipientName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function RecipientSurprisePage({
  params,
  searchParams,
}: {
  params: Promise<{ publicId: string }>;
  searchParams?: Promise<{
    name?: string;
    sender?: string;
    message?: string;
    template?: string;
    photos?: string;
    endearment?: string;
    question?: string;
    dodgeText?: string;
    audioUrl?: string;
  }>;
}) {
  const { publicId } = await params;
  const query = searchParams ? await searchParams : {};
  const isSample = publicId === SAMPLE_SURPRISE.publicId;

  // 1. Fetch from Supabase published_surprises cloud database
  let cloudRecord: any = null;
  if (!isSample) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("published_surprises")
        .select("*")
        .eq("public_id", publicId)
        .maybeSingle();
      cloudRecord = data;
    } catch (err) {
      console.warn("[Recipient Page] Cloud fetch note (using URL query fallback):", err);
    }
  }

  // 2. Resolve Template Definition: Cloud Record -> Query Param -> Slug heuristic -> Default
  const templateSlug =
    cloudRecord?.template_slug ||
    query.template ||
    (publicId.includes("golden") || publicId.includes("proposal") || publicId.startsWith("love-")
      ? "the-golden-proposal"
      : "sweet-celebration");

  const resolvedTemplate =
    templateRegistry.getTemplate(templateSlug) ||
    templateRegistry.getTemplate("sweet-celebration") ||
    templateRegistry.listTemplates()[0];

  const resolvedVersion =
    resolvedTemplate?.versions?.[0] ||
    templateRegistry.getTemplateVersion("ver-sweet-celebration-1-0-0")!;

  // 3. Resolve Personalization Fields
  const recipientName =
    query.name ||
    cloudRecord?.recipient_name ||
    (isSample ? SAMPLE_SURPRISE.recipient.name : "Maya");

  const senderName =
    query.sender !== undefined
      ? query.sender
      : cloudRecord?.sender_name !== undefined
      ? cloudRecord.sender_name
      : (isSample ? SAMPLE_SURPRISE.sender.name : "Alex");

  const message =
    query.message ||
    cloudRecord?.custom_message ||
    (isSample
      ? SAMPLE_SURPRISE.customMessage
      : templateSlug === "the-golden-proposal"
      ? "Of all the love stories in the world, ours will forever be my favorite."
      : "Happy Birthday! Wishing you a day as brilliant, vibrant, and unforgettable as you are!");

  const endearment =
    query.endearment ||
    cloudRecord?.endearment ||
    "My Everything";

  const question =
    query.question ||
    cloudRecord?.question ||
    "Will You Be Mine?";

  const dodgeText =
    query.dodgeText ||
    cloudRecord?.dodge_text ||
    `${recipientName}, aise kaise mana kar sakti ho! 😉💖`;

  const audioUrl =
    query.audioUrl ||
    cloudRecord?.audio_url ||
    "";

  // 3b. Resolve audio trim data from metadata
  const metadataObj = cloudRecord?.metadata || {};
  const audioStartTime: number = typeof metadataObj.audioStartTime === "number" ? metadataObj.audioStartTime : 0;
  const audioDuration: number | undefined = typeof metadataObj.audioDuration === "number" ? metadataObj.audioDuration : undefined;

  // 4. Handle Photos
  let photosList: string[] = [];
  const samplePhotos = [
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop",
  ];

  if (query.photos !== undefined) {
    if (query.photos.includes(",")) {
      photosList = query.photos.split(",");
    } else {
      const count = parseInt(query.photos, 10);
      photosList = samplePhotos.slice(0, isNaN(count) ? 2 : count);
    }
  } else if (Array.isArray(cloudRecord?.photos) && cloudRecord.photos.length > 0) {
    photosList = cloudRecord.photos;
  } else if (templateSlug === "memory-journey") {
    photosList = samplePhotos.slice(0, 3);
  } else {
    photosList = [SAMPLE_SURPRISE.photos[0]?.url || samplePhotos[0]];
  }

  const surpriseModel: SurpriseModel = {
    id: isSample ? SAMPLE_SURPRISE.id : "exp-" + publicId,
    publicId,
    creatorId: "user-creator-1",
    templateId: resolvedTemplate.id,
    templateVersionId: resolvedVersion.id,
    recipientName,
    senderName,
    message,
    specialDate: "2026-09-14",
    photos: photosList,
    status: "published",
    viewCount: isSample ? SAMPLE_SURPRISE.viewCount + 1 : 1,
    createdAt: "2026-09-14T08:00:00Z",
    updatedAt: "2026-09-14T08:00:00Z",
    publishedAt: "2026-09-14T08:00:00Z",
  };

  const { template, version, scenes } = templateRegistry.resolveSurpriseExperience(surpriseModel);

  const personalization: PersonalizationData = {
    recipient_name: surpriseModel.recipientName,
    sender_name: surpriseModel.senderName,
    message: surpriseModel.message,
    special_date: surpriseModel.specialDate,
    photo_1: surpriseModel.photos[0] || "",
    photo_2: surpriseModel.photos[1] || "",
    photo_3: surpriseModel.photos[2] || "",
    photo_4: surpriseModel.photos[3] || "",
    photo_5: surpriseModel.photos[4] || "",
  };

  return (
    <PublicSurpriseClient
      publicId={publicId}
      initialTemplate={template}
      initialVersion={version}
      initialScenes={scenes}
      initialPersonalization={personalization}
      initialSurprise={surpriseModel}
      endearment={endearment}
      question={question}
      dodgeText={dodgeText}
      audioUrl={audioUrl}
      audioStartTime={audioStartTime}
      audioDuration={audioDuration}
    />
  );
}
