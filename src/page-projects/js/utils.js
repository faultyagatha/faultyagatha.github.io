import * as THREE from "three";

export function coloursToArray(str) 
{
    return str.split('/').pop().split('-').map(function (hex) 
    {
        return new THREE.Color('#' + hex);
    });
};

export function lerp(current, target, speed = 0.1, limit = 0.001) 
{
    let change = (target - current) * speed;
    if (Math.abs(change) < limit) 
    {
      change = target - current;
    }
    return change;
}