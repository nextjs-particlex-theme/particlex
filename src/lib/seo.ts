import Post from "@/api/datasource/types/resource/Post";
import type {Metadata} from "next";
import datasource from "@/api/datasource";

export const generateSeoMetadata = async (post: Post): Promise<Metadata> => {
  const config = await datasource.getConfig()
  const {seo} = post
  return {
    title: `${seo.title} | ${config.title}`,
    description: seo.description,
    keywords: seo.keywords
  }
}