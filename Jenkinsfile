pipeline {
	agent any
	parameters {
		string(name: 'NodeProfile', defaultValue: "${env.DEFAULT_NODE_PROFILE}", description: 'npm run build:<profile>')
	}
	stages {
		stage('Build package') {
			agent {
				docker {
					image 'node:8-alpine'
					reuseNode true
				}
			}
			steps {
				sh 'npm install'
				sh "npm run build:${params.NodeProfile}"
			}
		}

		stage('Build docker image') {
			steps {
				sh 'docker build -t tsp-ui .'
			}
		}

		stage('Update service') {
			steps {
				sh "docker-compose up -d"
			}
		}
	}
	post {
		success {
			withCredentials([string(credentialsId: 'DINGTALK_ACCESS_TOKEN', variable: 'DINGTALK_ACCESS_TOKEN')]) {
				jenkinsDing accessToken: "${DINGTALK_ACCESS_TOKEN}",
					title: "${params.NodeProfile}系统【前端】部署完成",
					messageUrl: "https://tsp-ui.${params.NodeProfile}.epuchain.com/",
					picUrl: "${JENKINS_URL}/static/eebaf780/images/headshot.png"
			}
		}
		failure {
			withCredentials([string(credentialsId: 'DINGTALK_ACCESS_TOKEN', variable: 'DINGTALK_ACCESS_TOKEN')]) {
				jenkinsDing accessToken: "${DINGTALK_ACCESS_TOKEN}",
					title: "${params.NodeProfile}系统【前端】部署失败",
					content: "请点击进入Jenkins检查原因。",
					messageUrl: "${BUILD_URL}",
					picUrl: "${JENKINS_URL}/static/eebaf780/images/headshot.png"
			}
		}
	}
}
