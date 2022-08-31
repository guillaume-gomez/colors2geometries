import * as THREE from 'three';
export function groupsByColor(meshes, preserveHierarchy = true) {
    let meshesGroupedByColor = {};
    meshes.forEach(mesh => {
        const material = mesh.material;
        const key = material.color.getHexString();
        if (meshesGroupedByColor[key]) {
            meshesGroupedByColor[key] = [...meshesGroupedByColor[key], mesh];
        }
        else {
            meshesGroupedByColor[key] = [mesh];
        }
    });
    let groups = [];
    const offsetColor = 0.1;
    Object.values(meshesGroupedByColor).map((meshes, index) => {
        if (!preserveHierarchy) {
            meshes.forEach(mesh => {
                mesh.position.z = 0;
            });
            const group = new THREE.Group();
            group.add(...meshes);
            group.position.z = index * offsetColor;
            groups.push(group);
        }
        else {
            const group = new THREE.Group();
            group.add(...meshes);
            groups.push(group);
        }
    });
    return groups;
}
