export interface ExerciseSet {
  id: string;
  weight: number;
  reps: number;
  isCompleted: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  unit?: 'KG' | 'LB';
  sets: ExerciseSet[];
}

export interface WorkoutDay {
  id: string;
  userId: string;
  title: string;
  exercises: Exercise[];
  createdAt: any;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  date: any;
  exercises: Exercise[];
  totalVolume: number;
}
