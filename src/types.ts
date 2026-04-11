export interface Exercise {
  id: string;
  name: string;
  weight: number;
  sets: number;
  reps: number;
}

export interface Workout {
  id: string;
  userId: string;
  date: any; // Firestore Timestamp
  exercises: Exercise[];
  totalVolume: number;
}
