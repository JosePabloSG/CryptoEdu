import { NextRequest, NextResponse } from 'next/server';
import { CreateUserDTO } from '@/lib/types';
import { UserService } from '@/lib/user-service';

// Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateUserDTO;

    // Validate required fields
    if (!body.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await UserService.findUserByEmail(body.email);

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists', userId: existingUser.id },
        { status: 400 },
      );
    }

    // Create new user
    const newUser = await UserService.createUser(body);

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: newUser,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// Get user by email
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 },
      );
    }

    const user = await UserService.findUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error getting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
