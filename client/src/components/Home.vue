<template>
    <div class="wrapper">
        <h1>Welcome {{ username }}</h1>
        <div style="display: flex; gap: 2rem;">
            <div style="display: flex; flex-direction: column;">
                <label for="projectname">Project name:</label><!--Proje olusturma-->
                <input type="text" id="projectname" v-model="projectname" required>
                <button @click="createProject">Create Project</button>
            </div>
            <div style="display: flex; flex-direction: column;">
                <label for="projectkey">Project key:</label><!--Key ile katilma-->
                <input type="number" id="projectkey" v-model="projectkey" required>
                <button @click="addProject">Add Project</button>
            </div>
        </div>
    </div>
    <div class="list-div">
        <ul>
            <h1>Created Projects</h1><!--Olusturdugu projeler-->
            <li v-for="project in projects" :key="project.id">
                <span class="project-name">Project name: {{ project.name }}</span>
                <span class="project-key">Key: {{ project.project_key }}</span>
                <button @click="getProjectUsers(project.id)">Get users</button>
            </li>
        </ul>
        <ul>
            <h1>Your Projects</h1><!--Var oldugu projeler-->
            <li v-for="project in hasProjectsArr" :key="project.id">
                <span class="project-name">Project name: {{ project.name }}</span>
                <button @click="getProjectUsers(project.id)">Get users</button>
            </li>
        </ul>
        <ul>
            <h1>Active Users</h1><!--Secilen projedeki aktif kullanicilar-->
            <li v-for="(i, index) in projectusers" :key="i.id">
                <span class="project-name" :class="getUserStatus(i.id)">Username: {{ i.username }}</span>
                <button v-if="i.username !== username" @click="openChat(i)">Open Chat</button>
            </li>
        </ul>




    </div>
    <div id="users">
        <div class="wrapperUser">
            <div>
                <div>GLOBAL CHAT</div><!--Global sohbet-->
                <div :id="'output' + 0" class="output"></div>
                <input type="text" :id="'mesaj' + 0" v-model="message[0]">
                <button @click="sendMessage(0)">Send Message</button>
                <div>
                    <input type="file" name="file" :id="'file' + 0">
                    <button @click="sendFile(0)">Send File</button>
                </div>
            </div>
        </div>
        <div class="wrapperUser" v-if="showChat">
            <div>
                <div>CHAT WITH {{ messageusername }}</div><!--Kisisel sohbet-->
                <div :id="'output' + 1" class="output"></div>
                <input type="text" :id="'mesaj' + 1" v-model="message[1]">
                <button @click="sendMessage(1)">Send Message</button>
                <div>
                    <input type="file" :name="'file' + 1" :id="'file' + 1">
                    <button @click="sendFile(1)">Send File</button>
                </div>
            </div>
        </div>

    </div>

</template>

<script>
import UserService from "@/services/UserService"
import axios from "axios"
import router from "@/router";
import { io } from 'socket.io-client';
export default {
    data() {
        return {
            username: this.$route.query.username,
            projects: [],
            message: [],
            results: [],
            hasProjectsArr: [],
            userid: null,
            projectname: "",
            projectkey: "",
            projectusers: [],
            projectId: null,
            messageDebug: "",
            idList: [],
            messageusername: "",
            port: 8081,
            showChat:false
        };
    },
    created() {
        this.fetchProjects();
    },
    mounted() {//socket olusturma sockete veri yazma
        this.socket = io('https://socketproject.onrender.com', { transports: ['websocket'] });
        this.socket.on('connect', () => {
            console.log('Connected to server');
            console.log('Socket ID:', this.socket.id);
            this.socket.emit("online", this.userid)
        });
        this.socket.on("onlineList", (userIdList) => {
            console.log("Message received:", userIdList);
            this.idList = userIdList
            console.log(this.idList)

        });
        this.socket.on('disconnect', () => {
            this.socket.emit("disconnect", this.userid)
            console.log('Disconnected from server');
        });
        this.socket.on('message', (data) => {
            const outputID = 'output' + data.index;
            const outputDiv = document.getElementById(outputID);
            outputDiv.innerHTML += `<div>${data.username}: ${data.message}</div>`;
        });

        this.socket.on('fileDownload', (data) => {
            const file = new Blob([data.file]);
            const url = window.URL.createObjectURL(file);
            const messageDiv = document.getElementById('output' + data.index);
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.textContent = data.fileName;
            downloadLink.download = data.fileName;
            const downloadButton = document.createElement('button');
            downloadButton.textContent = 'Download';
            downloadButton.addEventListener('click', () => {
                downloadLink.click();
            });
            messageDiv.appendChild(downloadLink);
            messageDiv.appendChild(downloadButton);
            messageDiv.appendChild(document.createElement('br'));
            window.URL.revokeObjectURL(url);
        });
    },
    beforeUnmount() {
        this.socket.disconnect();
    },
    methods: {
        getUserStatus(id) {//online kullanicilari alma
            return this.idList.includes(id) ? 'online' : 'offline';
        },
        async openChat(element) {//kisisel sohber olusturma
            this.messageusername = element.username;
            this.showChat = true;
            if (document.getElementById("output1") != null) {
                document.getElementById("output1").innerHTML = ""
            }

            this.messageusername = element.username

        },

        async fetchProjects() {//projeleri alma
            try {
                const response = await UserService.getProjects(this.username);
                this.projects = response.data.projects;
                this.messageDebug = response.data.message
                this.results = response.data.results[0]
                this.userid = this.results.id
                this.hasProjects();

            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        },
        async hasProjects() {//var olan projeleri alma
            try {
                const response2 = await UserService.hasProjects(this.userid);
                this.hasProjectsArr = response2.data.hasProjects;

                this.messageDebug = response2.data.message

            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        },
        async getProjectUsers(projectId) {//projelerdeki kullanicilari alma
            this.projectusers = [];

            try {
                this.projectId = projectId;
                const response3 = await UserService.getProjectUsers(projectId);
                this.projectusers = response3.data.users;


            } catch (error) {
                console.error("Error fetching project users:", error);
            }
        }, async sendFile(index) {//dosya gonderme
            const fileInput = document.getElementById('file' + index);
            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = async () => {
                const fileData = reader.result;
                this.socket.emit('file', {
                    file: fileData,
                    fileName: file.name,
                    username: this.username,
                    index: index
                });
            };
            reader.readAsArrayBuffer(file);
        },
        async sendMessage(index) {//mesaj gonderma

            this.socket.emit('message', {
                message: this.message[index],
                username: this.username,
                index: index
            });
            this.message[index] = '';
        },
        async createProject() {//proje olusturma
            try {
                await UserService.create({
                    name: this.projectname,
                    creator_username: this.username,
                    userid: this.userid
                })
                this.fetchProjects();
            } catch (error) {
                this.error = error.response.data.error
            }
        },
        async addProject() {//proje ekleme
            try {
                await UserService.addProject({
                    projectkey: this.projectkey,
                    userid: this.userid
                })
                this.fetchProjects();
            } catch (error) {
                this.error = error.response.data.error
            }
        },

    }
};
</script>

<style scoped>
.wrapperUser {
    display: flex;
    height: 500px;
    flex-direction: column;
}

#users {
    display: flex;
    justify-content: start;
    gap: 1rem;
    overflow-x: scroll;
    width: 100%;
    align-items: flex-start;
}

.list-div {
    display: flex;
    justify-content: center;

}

.output {
    height: 300px;
    background-color: white;
    border: 1px solid #ccc;
    color: black;
    width: 300px;
    padding: 10px;
    margin-bottom: 10px;
}

.project-name {
    display: block;
    font-weight: bold;
}

.project-key {
    display: block;
    color: #888;
}

.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: auto;
    width: 100vw;
    background-color: #f0f0f0;
}

.form {
    background-color: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
}

.input-holder {
    display: flex;
    gap: 1rem;
    align-items: center;
}

input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

label {
    font-weight: bold;
}

.error {
    color: red;
    margin-bottom: 1rem;
}

button {
    background-color: #ffc107;
    color: #333;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #ffca28;
}

.online {
    color: green;

}

.offline {
    color: red;

}
</style>