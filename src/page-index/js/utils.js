import * as THREE from "three"

export function coloursToArray(str) 
{
    return str.split('/').pop().split('-').map(function (hex) 
    {
        return new THREE.Color('#' + hex);
    });
};

export function getRandomAxis() 
{
    return new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize();
}

export function getCentroid(geometry) 
{
    let ar = geometry.attributes.position.array;
    let len = ar.length;
    let x = 0,
      y = 0,
      z = 0;
    for (let i = 0; i < len; i = i + 3) 
    {
      x += ar[i];
      y += ar[i + 1];
      z += ar[i + 2];
    }
    return { x: (3 * x) / len, y: (3 * y) / len, z: (3 * z) / len };
}