-- CreateEnum
CREATE TYPE "NewsStatus" AS ENUM ('published', 'draft');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('available100', 'dependsCircumstances', 'cannotCommit');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('photo', 'video');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleAm" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "excerptAm" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "contentAm" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "image" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" "NewsStatus" NOT NULL DEFAULT 'published',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registration" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "church" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "tiktokUsername" TEXT NOT NULL,
    "contentType" TEXT[],
    "otherPlatforms" TEXT[],
    "contribution" TEXT NOT NULL,
    "availability" "AvailabilityStatus" NOT NULL,
    "ethicsStatement" TEXT,
    "agreeToCovenant" BOOLEAN NOT NULL,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'pending',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAm" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "roleAm" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaItem" (
    "id" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "title" TEXT NOT NULL,
    "titleAm" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
