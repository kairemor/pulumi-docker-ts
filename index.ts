import * as pulumi from "@pulumi/pulumi";
import * as docker from "@pulumi/docker";

// Define the Docker image to build
const repository = "docker.io/kairemor"; 
const imageName = "my-app";
const fullImageName = pulumi.interpolate`${repository}/${imageName}:v1.0.0`;

const image = new docker.Image(imageName, {
    build: {
        context: "./app", // path to your Dockerfile and build context
    },
    imageName: fullImageName,
});

// Define the Docker container to run
const container = new docker.Container("my-app-container", {
    image: image.imageName,
    ports: [{
        internal: 80,
        external: 8080,
    }],
});

// Export the container's name and the public URL
export const containerName = container.name;
export const containerUrl = container.ports.apply(ports => 
    `http://localhost:${ports ? ports[0].external : 8080}`
);
