node {
    stage('Checkout') {
        deleteDir() // Workdir cleanup
        def scmVars = checkout scm

        REVISION = scmVars.GIT_COMMIT
        TAG = "${REVISION[0..7]}-${UUID.randomUUID().toString()[-12..-1]}"
        echo "Revision: ${REVISION}"
        echo "Tag: ${TAG}"
    }
    stage('Build') {
            sh """

        aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 514510751048.dkr.ecr.us-west-2.amazonaws.com

        docker build \
          -t 514510751048.dkr.ecr.us-west-2.amazonaws.com/backend_servise_repo:${TAG} \
          --push .
        """
    }
    stage('Tests'){}
    stage('Publish'){}

}

