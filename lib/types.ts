export interface User {
  id: string;
  email: string;
  name?: string;
  favoriteCryptos: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateUserDTO {
  email: string;
  name?: string;
  favoriteCryptos?: string[];
}

export interface UpdateFavoritesDTO {
  userId: string;
  favoriteCryptos: string[];
}
