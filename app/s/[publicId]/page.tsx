import React from "react";
import { Metadata } from "next";
import { SAMPLE_SURPRISE } from "@/lib/constants";
import { templateRegistry } from "@/lib/engine/templateRegistry";
import { SurpriseModel, PersonalizationData } from "@/lib/engine/types";
import { PublicSurpriseClient } from "@/components/experience/PublicSurpriseClient";

// Export metadata and page component

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ publicId: string }>;
  searchParams?: Promise<{ name?: string; sender?: string }>;
}): Promise<Metadata> {
  const { publicId } = await params;
  const query = searchParams ? await searchParams : {};
  const isSample = publicId === SAMPLE_SURPRISE.publicId;
  const recipientName = query.name || (isSample ? SAMPLE_SURPRISE.recipient.name : "Someone Special");
  const senderName = query.sender || (isSample ? SAMPLE_SURPRISE.sender.name : "");

  const title = "🎁 Someone has a surprise for you!";
  const description = "Open your special birthday surprise ✨";
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
  searchParams?: Promise<{ name?: string; sender?: string; message?: string; template?: string; photos?: string }>;
}) {
  const { publicId } = await params;
  const query = searchParams ? await searchParams : {};

  // Resolve Surprise Model
  const isSample = publicId === SAMPLE_SURPRISE.publicId;
  const recipientName = query.name || (isSample ? SAMPLE_SURPRISE.recipient.name : "Maya");
  const senderName = query.sender !== undefined ? query.sender : (isSample ? SAMPLE_SURPRISE.sender.name : "Alex");
  const message =
    query.message ||
    (isSample
      ? SAMPLE_SURPRISE.customMessage
      : "Happy Birthday! Wishing you a day as brilliant, vibrant, and unforgettable as you are!");

  // Resolve Template Definition from TemplateRegistry
  const templateSlug = query.template || "sweet-celebration";
  const resolvedTemplate =
    templateRegistry.getTemplate(templateSlug) ||
    templateRegistry.getTemplate("sweet-celebration") ||
    templateRegistry.listTemplates()[0];
  const resolvedVersion =
    resolvedTemplate?.versions?.[0] ||
    templateRegistry.getTemplateVersion("ver-sweet-celebration-1-0-0")!;

  // Handle Photos (supporting up to 5 photos with dynamic skipping for unused photo scenes)
  let photosList: string[] = [];
  const samplePhotos = [
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop",
  ];

  if (query.photos !== undefined) {
    const count = parseInt(query.photos, 10);
    photosList = samplePhotos.slice(0, isNaN(count) ? 2 : count);
  } else if (templateSlug === "memory-journey") {
    // Default to 3 photos for memory journey to showcase dynamic scene skipping for photos 4 & 5
    photosList = samplePhotos.slice(0, 3);
  } else {
    photosList = [
      SAMPLE_SURPRISE.photos[0]?.url || samplePhotos[0],
    ];
  }

  const surpriseModel: SurpriseModel = {
    id: isSample ? SAMPLE_SURPRISE.id : "exp-" + publicId,
    publicId,
    creatorId: "user-creator-1",
    templateId: resolvedTemplate.id,
    templateVersionId: resolvedVersion.id, // Locked version immutability
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

  // Resolve Template, Locked Version, and Scenes from Template Engine (with dynamic photo skipping)
  const { template, version, scenes } = templateRegistry.resolveSurpriseExperience(surpriseModel);

  // Bind Personalization Variables
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
    />
  );
}
