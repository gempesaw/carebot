node {
    stage 'build image'
    checkout scm
    def image = docker.build 'flowbot'

    image.inside {
        stage 'install deps'
        sh 'npm install'

        stage 'execute tests'
        sh 'npm test'
    }

    stage 'push image' {
        commit = sh(returnStdout: true, script: 'git rev-parse --short HEAD')
        docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
            app.push("${commit}")
        }
    }
}
