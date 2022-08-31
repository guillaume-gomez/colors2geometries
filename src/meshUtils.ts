import * as THREE from 'three';

interface meshesGroupedByColorInterface {
     [key: string]: THREE.Mesh[];
}

export function groupsByColor(meshes: THREE.Mesh[], preserveHierarchy: boolean = true) : THREE.Group[] {
    let meshesGroupedByColor : meshesGroupedByColorInterface = {};
    meshes.forEach(mesh => {
        const material = mesh.material as THREE.MeshStandardMaterial;
        const key = material.color.getHexString();
        if(meshesGroupedByColor[key]) {
            meshesGroupedByColor[key] = [...meshesGroupedByColor[key], mesh];
        } else {
            meshesGroupedByColor[key] = [mesh];
        }
    });

    let groups : THREE.Group[] = [];
    const offsetColor = 0.1;
    Object.values(meshesGroupedByColor).map((meshes, index) => {
        if(!preserveHierarchy) {
            meshes.forEach(mesh => {
                mesh.position.z = 0;
            });
            const group = new THREE.Group();
            group.add(...meshes);
            group.position.z = index * offsetColor;
            groups.push(group);
        } else {
            const group = new THREE.Group();
            group.add(...meshes);
            groups.push(group);
        }
    });
    return groups;
}