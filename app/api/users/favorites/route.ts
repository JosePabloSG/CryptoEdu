import { NextRequest, NextResponse } from 'next/server';
import { UpdateFavoritesDTO } from '@/lib/types';
import { UserService } from '@/lib/user-service';

// Update user favorites
export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as UpdateFavoritesDTO;

    // Validate required fields
    if (!body.userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 },
      );
    }

    if (!Array.isArray(body.favoriteCryptos)) {
      return NextResponse.json(
        { error: 'Favorite cryptos must be an array' },
        { status: 400 },
      );
    }

    // Check if user exists
    const user = await UserService.findUserById(body.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update favorites
    const success = await UserService.updateFavorites(
      body.userId,
      body.favoriteCryptos,
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update favorites' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: 'Favorites updated successfully',
        favoriteCryptos: body.favoriteCryptos,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error updating favorites:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// Get user favorites
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID parameter is required' },
        { status: 400 },
      );
    }

    const user = await UserService.findUserById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        favoriteCryptos: user.favoriteCryptos,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error getting favorites:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
