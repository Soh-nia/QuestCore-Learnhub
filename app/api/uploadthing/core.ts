import { createUploadthing, type FileRouter } from "uploadthing/next";
// import { UploadThingError } from "uploadthing/server";
import { auth } from '@/auth';

const f = createUploadthing();

const handleAuth = async () => {
    const session = await auth();
    const UserId = session?.user;
    if (!UserId) throw new Error("Unauthorized");
    return UserId;
};

export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    courseImage: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
    })
        .middleware(() => handleAuth())
        .onUploadComplete(() => { }),
    courseAttachments: f(["text", "image", "video", "audio", "pdf"])
        .middleware(() => handleAuth())
        .onUploadComplete(() => { }),
    chapterVideo: f({
        video: {
            maxFileSize: "512GB",
            maxFileCount: 1,
        },
    })
        .middleware(() => handleAuth())
        .onUploadComplete(() => { }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
