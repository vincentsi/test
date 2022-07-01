const dotenv = require('dotenv');
  dotenv.config();
const http = require("http"); 
const fs = require("fs")
const hostname = process.env.APP_LOCALHOST;
const port = process.env.APP_PORT;
const utils = require("./utils");

const dayjs = require('dayjs')
require('dayjs/locale/de')
dayjs.locale('de')
dayjs().locale('de').format()

let students = JSON.parse(fs.readFileSync("students.json"))

const server = http.createServer((req, res) => {

  let button ='<button>x</button>'
    const url = req.url.replace("/","")
      if (url === "users") {
        res.writeHead(200, { "Content-Type": "text/html" });
    
        let users = "<ul>";
        
        for (const { name } of students) {
          users += `<li>${name}${button}</li>`; 
        }
        users += "</ul>";

        let date = "<ul>";
        for (let { birth } of students) {
          birth = dayjs(birth).format('DD/MM/YYYY')
          date += `<li>${birth}</li>`;
        }
        date += "</ul>";

        res.end(`
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>liste utilisateur</title>
                </head>
                <body>
                
                <div>
                  ${users} 
                  ${date}
                  </div>
    
                  <p><a href="http://${hostname}:${port}">Home</a></p>
                </body>
            </html>
          `);
      }
      
      if (req.method === "POST") {
        let body = "";
        req.on("data", (data) => {
          body += data;
        });
        req.on("end", () => {
          const replacer = new RegExp(/\+/, "g");
          const input = body.toString().split(/&/)
          let birth = input[1].split(/=/)[1]
          const name = input[0].split(/=/)[1].replace(replacer, ' ');
          birth=dayjs(birth).format('DD-MM-YYYY')
          
          if (name) {
          let test = JSON.parse(fs.readFileSync("students.json")); test.push({name,birth} )
          fs.writeFileSync("students.json",JSON.stringify(test))
          students =JSON.parse(fs.readFileSync("students.json"));
          }
          res.writeHead(301, { Location: `http://${hostname}:${port}` });
          res.end();
        });
      }
      

  if (url === "") {
    const home = fs.readFileSync("./views/home.html");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(home);
  }

});


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});