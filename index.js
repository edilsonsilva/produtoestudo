const express = require("express")
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");


const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan("combined"));



const urldb = `mongodb+srv://elementar:Alunos123@projetoestudo.rjjrqph.mongodb.net/projetoestudo?retryWrites=true&w=majority`;mongoose.connect(urldb, { useNewUrlParser: true, useUnifiedTopology: true });


const schema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    cpf: { type: String, unique: true, required: true },
    telefone: { type: String },
    idade: { type: Number, min: 16, max: 120 },
    usuario: { type: String, unique: true },
    senha: { type: String },
    datacadastro: { type: Date, default: Date.now }
});

const Cliente = mongoose.model("Cliente", schema);

app.get("/", (req, res) => {
    Cliente.find().then((result) => {
        res.status(200).send({ output: "ok", payload: result });
    }).catch((erro) => {
        res.status(500).send({ output: `Erro ao processar dados -> ${erro}` });
    });
});

app.post("/insert", (req, res) => {
    const dados = new Cliente(req.body);
    dados.save().then((result) => {
        res.status(201).send({ output: `Cadastro realizado`, payload: result });
    }).catch((erro) => {
        res.status(500).send({ output: `Erro ao cadastrar -> ${erro}` })
    });
});

app.put("/update/:id", (req, res) => {
    Cliente.findByIdAndUpdate(req.params.id,req.body,{new:true}).then((result)=>{
        if(!result){
            return res.status(400).send({output:`Não foi possível atualizar`});
        }
        res.status(202).send({output:`Atualizado`,payload:result});
    }).catch((erro)=>{
        res.status(500).send({output:`Erro ao processar a solicitação -> ${erro}`});
    });
});


app.delete("/delete/:id", (req, res) => {
    Cliente.findByIdAndDelete(req.params.id).then((result)=>{
        res.status(204).send({payload:result});
    }).catch((erro)=>console.log(`Erro ao tentar apagar -> ${erro}`));
});

app.use((req, res) => {
    res.type("application/json");
    res.status(404).send("404 - Not Found");
});

app.listen(3000, () => {
    console.log(`Servidor online em http://localhost:3000`)
})
