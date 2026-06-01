export type PhysicsObject = {
  id: string;
  type: 'particle' | 'block' | 'ball' | 'vehicle' | 'rope' | 'spring' | 'pulley' | 'rod' | 'slope';
  title: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  mass?: number;
  velocity?: number; // x velocity (vx)
  vy?: number;       // y velocity
  friction?: number;
  restitution?: number; // 弹性系数 e (object specific overrides)
  angle?: number;
};

export type CollisionSettings = {
  type: 'elastic' | 'perfectly_inelastic' | 'inelastic';
  restitution: number; // 0 to 1
};


