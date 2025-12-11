pipeline {
  agent any

  environment {
    EC2_USER = "ubuntu"
    EC2_HOST = "18.118.99.238"
    SSH_CREDENTIALS_ID = "ec2-ssh-key"
    REMOTE_APP_DIR = "~/Softwaresunat"   // donde esté tu repo en EC2
    CONTAINER_NAME = "mi-react-container"
    IMAGE_NAME = "mi-react-app"          // etiqueta local de la imagen
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build on Jenkins (optional)') {
      steps {
        echo "🔧 (Opcional) Construyendo aquí para validar que build funcione..."
        sh 'npm ci || true'          // opcional: solo para validar
        sh 'npm run build || true'
      }
    }

    stage('Deploy to EC2 via SSH') {
      steps {
        sshagent([env.SSH_CREDENTIALS_ID]) {
          sh """
            ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
              set -e

              # 1) ir al directorio del proyecto (si no existe, clonarlo)
              mkdir -p ${REMOTE_APP_DIR}
              cd ${REMOTE_APP_DIR}

              # 2) asegurarse de tener la última versión
              if [ -d .git ]; then
                git fetch --all --prune
                git reset --hard origin/main
              else
                git clone https://github.com/sromansilva/Softwaresunat.git .
              fi

              # 3) construir imagen en EC2 (usa el Dockerfile que ya tienes)
              sudo docker build -t ${IMAGE_NAME}:latest .

              # 4) detener y borrar contenedor viejo (si existe)
              sudo docker stop ${CONTAINER_NAME} || true
              sudo docker rm ${CONTAINER_NAME} || true

              # 5) correr contenedor nuevo (mapear 3000 host -> 80 container)
              sudo docker run -d --name ${CONTAINER_NAME} --restart unless-stopped -p 3000:80 ${IMAGE_NAME}:latest

              # 6) imprimir status
              sudo docker ps --filter "name=${CONTAINER_NAME}"
            '
          """
        }
      }
    }

  }

  post {
    success {
      echo "✅ Deploy completado. Revisa: http://${EC2_HOST}:3000"
    }
    failure {
      echo "❌ Pipeline falló. Revisa los logs."
    }
  }
}
