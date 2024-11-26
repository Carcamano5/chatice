import express from "express";
//commonjs const express = require('express')

import session from "express-session";


import cookieParser from "cookie-parser";



const app = express();

app.use(session({
  secret: 'Mazzega',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 30,
    secure: false,
    httpOnly: true,
  }
  
}))

app.use(cookieParser());
//configurar aplicação para receber dados do formulario

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./pages/public'));

const porta = 3000;
const host = "0.0.0.0"; //IP se refere-se a todas as interfaces locais (Placas de rede) no seu PC

var listaProds = []; //Variavel global - Lista para armazenar os cadastros
//implementar a tareda para entregar um formulario html para o cliente

function CadsProdsView(req, resp) {
  resp.send(`
        <html>
                <head>
                    <tittle>Cadastro de Produtos</tittle>
                    
                </head>
                <body>
                    <div class="container text-center">
                        <h1>Cadastro de Produtos</h1>

        <form method="POST" action="/Produto" class="row g-3">

        <div class="col-md-4">
          <label for="validationDefault01"  class="form-label">Codigo de barras:</label>
          <input type="text" class="form-control" id="codB" name="codB" >
        </div>

        <div class="col-md-4">
          <label for="validationDefault02"  class="form-label">Descrição do produto:</label>
          <input type="text" class="form-control" id="desc" name="desc"  >
        </div>
        
        </div>
        <div class="col-md-6">
          <label for="validationDefault03" name="cod" class="form-label">Preço de custo</label>
          <input type="number" class="form-control" id="precoC" name="precoC" >
        </div>



        
        <div class="col-md-6">
          <label for="validationDefault03" name="cod" class="form-label">Preço de venda</label>
          <input type="text" class="form-control" id="vendaP" name="vendaP" >
        </div>

        <div class="col-md-6">
          <label for="validationDefault03" name="cod" class="form-label">Data de validade</label>
          <input type="text" class="form-control" id="vall" name="vall" >
        </div>

        <div class="col-md-6">
          <label for="validationDefault03" name="cod" class="form-label">quantidade em estoque</label>
          <input type="text" class="form-control" id="estoque" name="estoque" >
        </div>

         <div class="col-md-6">
          <label for="validationDefault03" name="cod" class="form-label">Nome do fabricante</label>
          <input type="text" class="form-control" id="fab" name="fab" >
        </div>

        
        <div class="col-12">
          <button class="btn btn-primary" type="submit">Cadastrar Produto</button>
        </div>
      </form>

                    </div>
                </body>
                
        </html>
    `);
}

function menuView(req, resp) {
  const dataHoraUlt = req.cookies['dataHoraUlt'];
  if(!dataHoraUlt)
  {
    dataHoraUlt = ''
  }
  resp.send(`
        <head>
            <tittle>Menu de cadastro de Produtos</tittle>
        </head>
        <body>
             <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-md">
                    <a class="navbar-brand" href="/Produto">Cadastrar Podutos</a>
                    <a class="navbar-brand" href="/logout">Logout</a>
                 </div>
            </nav><span>Seu ultimo acesso em ${dataHoraUlt}</span>
        </body>
        `);
}

function CadastraProduto(req, resp) {
  //recuperar os dados do formulario enviado para o servidor
  //adicionar o produto na lista
  const barras = req.body.codB;
  const desc = req.body.desc;
  const precoC = req.body.precoC;
  const venda = req.body.vendaP;
  const vall = req.body.vall;
  const estoque = req.body.estoque;
  const fab = req.body.fab;
 

  //valida dados

  if (barras && desc && precoC && venda && vall && estoque && fab) {
    //entrada valida!

    const produtos = { barras, desc,  precoC,  venda,  vall,  estoque,  fab };//dados validos = cria instancia
    listaProds.push(produtos);

    //mostrar a lista de produtos
    resp.write(`
            <html>
                <head>
                    <tittle>Produtos Cadastrados</tittle>
                    <meta charset = "utf-8">
                </head>

                 <body>
                    <table class="table">
                         <thead>
                        <tr>
                           
                            <th scope="col">Codigo de barras:</th>
                            <th scope="col">Descrição:</th>
                            <th scope="col">Preço de custo:</th>
                            <th scope="col">Preço de venda</th>
                            <th scope="col">Validade do produto</th>
                            <th scope="col">Quantidade em estoque do produto</th>
                            <th scope="col">Fabricante do produto</th>
                             </tr>
                                </thead>
                                     <tbody>`);
    //adicionar as linhas da tabela, para cada produto nos devemos criar uma linha
    for (var i = 0; i < listaProds.length; i++) {
      resp.write(`<tr>
                        <td>${listaProds[i].barras}</td>
                        <td>${listaProds[i].desc}</td>
                        <td>${listaProds[i].precoC}</td>
                        <td>${listaProds[i].venda}</td>
                        <td>${listaProds[i].vall}</td>
                        <td>${listaProds[i].estoque}</td>
                        <td>${listaProds[i].fab}</td>
                    </tr>`);
    }

    resp.write(`</tbody>
            </table>
             </body>
            </html>
        `);
  } //fim da validação

  else
  {
    //enviar de volta o form de cadastro contendo msg de validação
    //implementar o html com o esse conteud!
    resp.write(` <html>
                <head>
                    <tittle>Cadastro de Produtos</tittle>
                    <meta charset = "utf-8">
                    
                </head>
                <body>
                    <div class="container text-center">
                        <h1>Cadastro de Produtos</h1>

        <form method="POST" action="/Produto" class="row g-3">
        <div class="col-md-4">
          <label for="validationDefault01"  class="form-label">Codigo de barras:</label>
          <input type="text" class="form-control" id="nome" name="nome"value="${barras}">
        </div>`);
        if(!barras || barras.length < 5)
        {
          resp.write(`
                <div>
                    <span >O Codigo de barras não pode estar vazio ou menor que 5 caracteres</span>
                     
                </div>
            `);
        }
        resp.write(`
                <div class="col-md-4">
                 <label for="validationDefault02"  class="form-label">Descrição:</label>
                <input type="text" class="form-control" id="desc" name="desc" value="${desc}" >
        </div>
          `)
          if(!desc || desc.length < 5)
          {
            resp.write(`
              <div>
                  <span >A descrição não pode estar vazio ou menor que 5 caracteres</span>
              </div>
          `);
          }
          resp.write(`
                 <div class="col-md-6">
                     <label for="validationDefault03" name="cod" class="form-label">Preço de custo</label>

                      <input type="text" class="form-control" id="cod" name="cod" value="${precoC}">
                  </div>
            `)
            if(!precoC || precoC < 1)
            {
              resp.write(`
                     <div>
                          <span >O preço de custo não pode ser menor que 1 ou vazio</span>
                      </div>
                </html>`)
            }



            resp.write(`
              <div class="col-md-6">
                  <label for="validationDefault03" name="cod" class="form-label">Preço de venda</label>

                   <input type="text" class="form-control" id="cod" name="cod" value="${venda}">
               </div>
         `)
         if(!venda || venda < 1)
         {
           resp.write(`
                  <div>
                       <span >O preço de venda não pode ser menor que 1 ou vazio</span>
                   </div>
             </html>`)
         }
          


         resp.write(`
          <div class="col-md-6">
              <label for="validationDefault03" name="cod" class="form-label">Validade</label>

               <input type="text" class="form-control" id="cod" name="cod" value="${vall}">
           </div>
     `)
     if(!vall )
     {
       resp.write(`
              <div>
                   <span >A validade deve ser informada</span>
               </div>
         </html>`)
     }
        
     resp.write(`
      <div class="col-md-6">
          <label for="validationDefault03" name="cod" class="form-label">Quantidade em estoque</label>

           <input type="text" class="form-control" id="cod" name="cod" value="${estoque}">
       </div>
 `)
 if(!estoque)
 {
   resp.write(`
          <div>
               <span >A quantidade em estoque deve ser informada</span>
           </div>
     </html>`)
 }

 resp.write(`
  <div class="col-md-6">
      <label for="validationDefault03" name="cod" class="form-label">Fabricante</label>

       <input type="text" class="form-control" id="cod" name="cod" value="${fab}">
   </div>
`)
if(!fab || fab.length < 5)
{
resp.write(`
      <div>
           <span >O nome do fabricante deve ser informado, e deve ter no minimo 5 caracteres</span>
       </div>
 </html>`)
}

  }//fim else

  resp.end(); //sera enviada a resposta
}

function autenticar(req, resp)
{
  const usuario = req.body.usuario;
  const senha = req.body.senha;

  if(usuario === 'admin' && senha === '123')
  {
    req.session.usuarioLogado = true
    resp.cookie('dataHoraUlt',new Date().toLocaleString(), {maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true});
    resp.redirect("/")
  }
  else
  {
    resp.send(`<html>
              <head>
    <meta charset="utf-8">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
</head>

      <body>
        <p>senha invalida</p>
                <div>
                  <a href="/login.html">Tentar denovo</a>
                </div>
      </html>
      </body>
       <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
        crossorigin="anonymous"></script>
      `
    );
  }
}

function verificarAut(req, resp, next)
{
  if(req.session.usuarioLogado)
  {
    next();
  }
  else
  {
    resp.redirect('/login.html');
  }

}

app.get('/login', (req, resp) => {
  resp.redirect('/login.html');
});

app.get('/logout', (req, resp) =>{
  req.session.destroy();
})
app.post('/login', autenticar);
app.get("/", verificarAut, menuView);
app.get("/Produto",verificarAut, CadsProdsView); //enviar o formulario para cadastrar o aluno
//novidade desta aula é o metodo post
app.post("/Produto",verificarAut,  CadastraProduto);

app.listen(porta, host, () => {
  console.log(
    `Servidor iniciado e em execução no endereço http:// ${host}:${porta}`
  );
});
