import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";

export async function POST(req: Request) {
    try {
        const { filename, contentType } = await req.json();

        if (!filename || !contentType) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        // Clean filename and ensure uniqueness
        const cleanFilename = filename.replace(/\s+/g, '-');
        const key = `videos/${Date.now()}-${cleanFilename}`;

        // Environment check
        const BUCKET = process.env.R2_BUCKET;
        if (!BUCKET) throw new Error("R2_BUCKET not configured");

        const command = new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            ContentType: contentType,
        });

        const uploadUrl = await getSignedUrl(r2, command, {
            expiresIn: 3600, // 1 hour expiration
        });

        const publicBase = process.env.R2_PUBLIC_URL || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${BUCKET}`;

        return NextResponse.json({
            uploadUrl,
            fileUrl: `${publicBase}/${key}`,
        });
    } catch (err: any) {
        console.error("Presign Error:", err);
        return NextResponse.json({ error: err.message || "Upload sign failed" }, { status: 500 });
    }
}
