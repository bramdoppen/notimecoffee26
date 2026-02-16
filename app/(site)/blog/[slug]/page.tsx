interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  return (
    <div className="container-site py-24">
      <p className="text-stone">Blog post: {slug}</p>
    </div>
  );
}
