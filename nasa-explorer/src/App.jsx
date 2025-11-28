import React, { Component } from 'react';


export default class App extends Component {

  state = {
    dailyPhoto: null,
    searchPhotos: []
  }

  fotoDoDia = () => {
    console.log('V0: Preparado para buscar a Foto do Dia no componentDidMount.');
  }

  onBuscaRealizada = (termo, ano) => {
    console.log(`V0: A busca por ${termo} em ${ano} será implementada em breve.`);
  }

  componentDidMount(){
    this.fotoDoDia();
  }

  Rodape = () => (
    <div className="col-12 border-top-1 border-400 p-2 mt-3 text-center">
      <p className="m-0">Desenvolvedor: Marcus</p>
    </div>
  )

  render() {
    return (
      <div className='grid w-9 m-auto border-1 border-400'>


        <div className='col-12 p-3 text-center'>

          <h1>NASA EXPLORER</h1>
        </div>


        <div className='col-12 border-1 border-400 p-3 mt-3'>
          <h2>1. Foto do Dia (APOD)</h2>
          <div className="grid">
            <p className="col-12 text-center">
              FOTO
            </p>
          </div>
        </div>


<div className='col-12 border-1 border-400 p-3 mt-3'>
  <h2>2. Buscar Imagens</h2>

  <div className="grid formgrid">


    <div className="col-12">
      <input
        type="text"
        placeholder="Digite o termo..."
        className="col-12 border-1 border-400 p-2"
        ref={el => this.inputTermo = el}
      />
    </div>


      <div className="col-12 mt-2">
        <div className="grid">
          {[2025, 2024, 2023, 2022, 2021, 2020].map(ano => (
            <div className="col-4 p-1" key={ano}>
              <button
                onClick={() => this.setState({ anoSelecionado: ano })}
                className={
                  "col-12 p-2 border-1 cursor-pointer " +
                  (this.state.anoSelecionado === ano
                    ? "border-blue-500 font-bold"
                    : "border-400")
                }
              >
                {ano}
              </button>
            </div>
          ))}
        </div>
      </div>


      <div className="col-12 mt-2">
        <button
          onClick={() => {
            const termo = this.inputTermo.value;
            const ano = this.state.anoSelecionado;
            this.onBuscaRealizada(termo, ano);
          }}
          className='col-12 border-1 border-400 p-2 cursor-pointer'
        >
          Buscar
        </button>
      </div>

    </div>
  </div>

        {/* Resultados */}
        <div className='col-12 border-1 border-400 p-3 mt-3'>
          <h2>3. Resultados da Busca</h2>
          <div className="grid">
            <p className="col-12 text-center">
              Os resultados da busca aparecerão aqui.
            </p>
          </div>
        </div>

        <this.Rodape />
      </div>
    );
  }
}
