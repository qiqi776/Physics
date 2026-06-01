import { PhysicsObject, CollisionSettings } from '../types';

export function stepPhysics(elements: PhysicsObject[], dt: number, settings: CollisionSettings): PhysicsObject[] {
  const g = 9.8; // 重力加速度

  // 做一次深拷贝，防止直接修改状态
  let nextElements = JSON.parse(JSON.stringify(elements)) as PhysicsObject[];

  // 1. 初步积分 (欧拉法)
  nextElements.forEach(el => {
    if (['slope', 'pulley', 'rope', 'spring', 'rod'].includes(el.type)) return;

    el.vy = (el.vy || 0) - g * dt;
    el.y = (el.y || 0) + el.vy * dt;
    
    // 水平初步位置
    el.x = el.x + (el.velocity || 0) * dt;
  });

  // 2. 垂直碰撞检测与堆叠逻辑
  // 按照 Y 坐标排序(从下到上)，逐个解析碰撞保证不穿模
  nextElements.sort((a, b) => a.y - b.y);

  for (let el of nextElements) {
    if (['slope', 'pulley', 'rope', 'spring', 'rod'].includes(el.type)) continue;

    // 与地面的碰撞
    if (el.y < 0) {
      el.y = 0;
      el.vy = 0;
    }

    const wA = el.width || 1;
    const hA = el.height || 1;

    // 与下方物体的堆叠干涉判断
    for (let other of nextElements) {
      if (other.id === el.id) continue;
      if (['slope', 'pulley', 'rope', 'spring', 'rod'].includes(other.type)) continue;

      const wB = other.width || 1;
      const hB = other.height || 1;

      // 如果它们在X轴上有重叠 (水平投影重叠)
      const isIntersectX = Math.abs(el.x - other.x) < (wA + wB) / 2;

      // 如果el试图掉进other内部 (el在上方，但是y比other的顶部还低)
      // 我们只处理 el 原本在上方，现在侵入了 other。由于排好序了，通常 el 在 other 之上。
      if (isIntersectX && el.y < other.y + hB && el.y + hA / 2 > other.y + hB) {
        el.y = other.y + hB;
        el.vy = 0;
      }
    }
  }

  // 3. 水平摩擦力处理
  nextElements.forEach(el => {
    if (['slope', 'pulley', 'rope', 'spring', 'rod'].includes(el.type)) return;

    // 简单起见：只有当 vy === 0 即受到支持力时，才计算动摩擦力
    if (el.vy === 0) {
      let v = el.velocity || 0;
      const friction = el.friction !== undefined ? el.friction : 0.2;
      let a = 0;

      if (Math.abs(v) > 0.05) {
        a = -Math.sign(v) * friction * g;
        let newV = v + a * dt;
        // 如果穿越了 0，说明停下了
        if (Math.sign(v) !== Math.sign(newV)) {
          newV = 0;
        }
        el.velocity = newV;
      } else {
        el.velocity = 0; // 避免极小值抖动
      }
    }
  });

  // 4. 水平碰撞检测与各类型碰撞响应
  const physicalObjs = nextElements.filter(el => ['vehicle', 'block', 'ball', 'particle'].includes(el.type));
  
  for (let i = 0; i < physicalObjs.length; i++) {
    for (let j = i + 1; j < physicalObjs.length; j++) {
      const a = physicalObjs[i];
      const b = physicalObjs[j];
      
      const wA = a.width || 1;
      const hA = a.height || 1;
      const wB = b.width || 1;
      const hB = b.height || 1;
      
      // 判断是否在同一水平线上 (Y轴投影重叠)
      const isIntersectY = Math.abs((a.y + hA / 2) - (b.y + hB / 2)) < (hA + hB) / 2;
      
      if (isIntersectY) {
        // 微小缩减避免视觉空隙，让物体看起来确实碰撞在一起
        const minDist = (wA + wB) / 2 - 0.02;
        
        if (Math.abs(a.x - b.x) <= minDist) {
          const vA = a.velocity || 0;
          const vB = b.velocity || 0;
          
          // 确保它们正在相互靠近
          if ((a.x < b.x && vA > vB) || (a.x > b.x && vA < vB)) {
            const m1 = a.mass || 1;
            const m2 = b.mass || 1;
            
            const e = settings.restitution;
            
            // 碰撞公式计算新速度
            const newVa = (m1 * vA + m2 * vB + m2 * e * (vB - vA)) / (m1 + m2);
            const newVb = (m1 * vA + m2 * vB + m1 * e * (vA - vB)) / (m1 + m2);
            
            a.velocity = newVa;
            b.velocity = newVb;
            
            // 位置微调：将物体向两侧推开，防止卡在重叠地带导致下一帧粘滞算错
            const overlap = minDist - Math.abs(a.x - b.x);
            if (a.x < b.x) {
              a.x -= overlap / 2;
              b.x += overlap / 2;
            } else {
              a.x += overlap / 2;
              b.x -= overlap / 2;
            }
          }
        }
      }
    }
  }

  return nextElements;
}
