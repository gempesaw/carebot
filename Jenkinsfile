node {
    def image
    stage 'build image' {
        checkout scm
        image = docker.build 'gempesaw/flowbot'
    }

    stage 'execute tests' {
        image.inside {
            sh 'npm test'
        }
    }

    stage 'push image' {
        commit = sh(returnStdout: true, script: 'git rev-parse --short HEAD')
        docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
            image.push("${commit}")
        }
    }
}
