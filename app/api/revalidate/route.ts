/**
 * Sanity webhook revalidation endpoint.
 *
 * Receives webhook from Sanity on document publish/unpublish,
 * revalidates the appropriate Next.js cache tag.
 *
 * Webhook config in Sanity:
 *   URL: https://notimecoffee.nl/api/revalidate
 *   Trigger: Create, Update, Delete
 *   Projection: { _type }
 *   Secret: SANITY_REVALIDATE_SECRET
 */

import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

// Map Sanity document types to cache tags
const TYPE_TO_TAG: Record<string, string> = {
  product: 'product',
  productCategory: 'productCategory',
  store: 'store',
  blogPost: 'blogPost',
  page: 'page',
  siteSettings: 'siteSettings',
  promotion: 'promotion',
};

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-sanity-secret');
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;

  // Validate webhook secret
  if (!expectedSecret) {
    console.warn('SANITY_REVALIDATE_SECRET not set — webhook validation disabled');
  } else if (secret !== expectedSecret) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { _type } = body;

    if (!_type) {
      return NextResponse.json(
        { message: 'Missing _type in webhook body' },
        { status: 400 }
      );
    }

    const tag = TYPE_TO_TAG[_type];

    if (!tag) {
      // Unknown type — not an error, just nothing to revalidate
      return NextResponse.json({
        message: `No cache tag for type "${_type}" — skipping`,
        revalidated: false,
      });
    }

    revalidateTag(tag);

    return NextResponse.json({
      message: `Revalidated tag: ${tag}`,
      revalidated: true,
      tag,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid request body' },
      { status: 400 }
    );
  }
}
