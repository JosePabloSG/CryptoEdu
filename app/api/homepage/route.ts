import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { COLLECTIONS, DB_NAME } from '@/lib/db-schema';
import { HomepageData } from '@/lib/types/homepage';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const homepageData = await db.collection<HomepageData>(COLLECTIONS.HOMEPAGE)
      .findOne({});

    if (!homepageData) {
      return NextResponse.json(
        { error: 'Homepage data not found' },
        { status: 404 }
      );
    }

    // Remove MongoDB's _id field before returning
    const { _id, ...cleanData } = homepageData;
    return NextResponse.json(cleanData);
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
