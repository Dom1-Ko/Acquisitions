set -e

NAME="kubernetes-api"
USERNAME="mrkyojin"
IMAGE="$USERNAME/$NAME:latest"

echo "Building Docker Image..."
echo $IMAGE
docker build -t $IMAGE .

echo "Pushing Image To Docker Hub..."
docker push $IMAGE

echo "Applying kubernetes Manifests..."
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

echo "Gettting Pods..."
kubectl get pods

echo "Getting services..."
kubectl get services

echo "Fetching the main service..."
kubectl get services $NAME-service