-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "arrondissement" TEXT NOT NULL,
    "lieuDit" TEXT NOT NULL,
    "commune" TEXT NOT NULL,
    "itineraire" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estimation" (
    "id" SERIAL NOT NULL,
    "valeurParM2" BIGINT NOT NULL,
    "nombreDeM2" BIGINT NOT NULL,
    "valeurParcelle" BIGINT NOT NULL,
    "ValeurVenalBati" BIGINT,
    "valeurVenalImmeuble" BIGINT,

    CONSTRAINT "Estimation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" SERIAL NOT NULL,
    "composition" JSONB NOT NULL,
    "signature" TEXT NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bien" (
    "id" SERIAL NOT NULL,
    "designation" TEXT NOT NULL,
    "dateVisite" TIMESTAMP(3) NOT NULL,
    "nature" TEXT NOT NULL,
    "addressId" INTEGER NOT NULL,
    "estimationId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "Bien_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "expireAt" BIGINT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "key" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blocked" (
    "id" SERIAL NOT NULL,
    "deblockAt" BIGINT NOT NULL,
    "asBlocked" BOOLEAN NOT NULL DEFAULT true,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Blocked_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "status" TEXT NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rapport" (
    "id" SERIAL NOT NULL,
    "dateCreation" TIMESTAMP(3) NOT NULL,
    "bienId" INTEGER NOT NULL,
    "templateId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Rapport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Template_signature_key" ON "Template"("signature");

-- CreateIndex
CREATE UNIQUE INDEX "Bien_designation_key" ON "Bien"("designation");

-- CreateIndex
CREATE UNIQUE INDEX "Bien_addressId_key" ON "Bien"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "Bien_estimationId_key" ON "Bien"("estimationId");

-- CreateIndex
CREATE UNIQUE INDEX "Token_key_key" ON "Token"("key");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Rapport_bienId_key" ON "Rapport"("bienId");

-- CreateIndex
CREATE UNIQUE INDEX "Rapport_templateId_key" ON "Rapport"("templateId");

-- CreateIndex
CREATE UNIQUE INDEX "Rapport_userId_key" ON "Rapport"("userId");

-- AddForeignKey
ALTER TABLE "Bien" ADD CONSTRAINT "Bien_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bien" ADD CONSTRAINT "Bien_estimationId_fkey" FOREIGN KEY ("estimationId") REFERENCES "Estimation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bien" ADD CONSTRAINT "Bien_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blocked" ADD CONSTRAINT "Blocked_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rapport" ADD CONSTRAINT "Rapport_bienId_fkey" FOREIGN KEY ("bienId") REFERENCES "Bien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rapport" ADD CONSTRAINT "Rapport_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rapport" ADD CONSTRAINT "Rapport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
