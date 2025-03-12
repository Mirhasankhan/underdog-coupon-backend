export interface IRestaurant {
  imageUrl: string;
  videoUrl?: string;
  restaurantName: string;
  contact: string;
  location: string;

}

export interface IUpdateRestaurant {
  imageUrl?: string;
  videoUrl?: string;
  restaurantName?: string;
  contact?: string;
  location?: string;
}
