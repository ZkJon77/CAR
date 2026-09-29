// app.js — Lógica do frontend (CRUD de carros via fetch)

// =============================================
// 🔧 CONFIGURAÇÃO — Altere a URL da API aqui
// =============================================
const API_URL = 'http://localhost:3000/api/cars';

// =============================================
// 📦 Elementos do DOM
// =============================================
const carForm = document.getElementById('car-form');
const carIdInput = document.getElementById('car-id');
const marcaInput = document.getElementById('marca');
const modeloInput = document.getElementById('modelo');
const precoInput = document.getElementById('preco');
const fotoInput = document.getElementById('foto');
const formTitle = document.getElementById('form-title');
const btnSubmit = document.getElementById('btn-submit');
const btnCancel = document.getElementById('btn-cancel');
const btnText = btnSubmit.querySelector('.btn__text');
const btnLoader = btnSubmit.querySelector('.btn__loader');
const carsGrid = document.getElementById('cars-grid');
const loadingEl = document.getElementById('loading');
const emptyState = document.getElementById('empty-state');
const carCount = document.getElementById('car-count');
const toast = document.getElementById('toast');

// =============================================
// 🚀 Inicialização
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  loadCars();
});

carForm.addEventListener('submit', handleSubmit);
btnCancel.addEventListener('click', resetForm);

// =============================================
// 📡 Funções de API
// =============================================

/**
 * Carrega todos os carros da API e renderiza na tela.
 */
async function loadCars() {
  showLoading(true);
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao carregar carros.');
    const cars = await response.json();
    renderCars(cars);
  } catch (error) {
    console.error(error);
    showToast('Erro ao carregar carros. Verifique se a API está rodando.', 'error');
    renderCars([]);
  } finally {
    showLoading(false);
  }
}

/**
 * Cria ou atualiza um carro dependendo do estado do formulário.
 */
async function handleSubmit(e) {
  e.preventDefault();

  const marca = marcaInput.value.trim();
  const modelo = modeloInput.value.trim();
  const preco = parseFloat(precoInput.value);
  const foto = fotoInput.value.trim();

  // Validação no frontend
  if (!marca || !modelo || isNaN(preco)) {
    showToast('Preencha todos os campos obrigatórios.', 'error');
    return;
  }

  if (preco < 0) {
    showToast('O preço não pode ser negativo.', 'error');
    return;
  }

  const carData = { marca, modelo, preco, foto };
  const editId = carIdInput.value;

  setSubmitLoading(true);

  try {
    let response;

    if (editId) {
      // Atualizar
      response = await fetch(`${API_URL}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData),
      });
    } else {
      // Criar
      response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData),
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao salvar carro.');
    }

    showToast(editId ? 'Carro atualizado com sucesso!' : 'Carro cadastrado com sucesso!', 'success');
    resetForm();
    loadCars();
  } catch (error) {
    console.error(error);
    showToast(error.message, 'error');
  } finally {
    setSubmitLoading(false);
  }
}

/**
 * Preenche o formulário com os dados do carro para edição.
 */
function editCar(car) {
  carIdInput.value = car._id;
  marcaInput.value = car.marca;
  modeloInput.value = car.modelo;
  precoInput.value = car.preco;
  fotoInput.value = car.foto || '';

  formTitle.textContent = 'Editar Carro';
  btnText.textContent = 'Salvar Alterações';
  btnCancel.style.display = 'inline-flex';

  // Scroll para o formulário
  document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Deleta um carro após confirmação.
 */
async function deleteCar(id, modelo) {
  const confirmed = confirm(`Tem certeza que deseja excluir o carro "${modelo}"?`);
  if (!confirmed) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

    if (!response.ok && response.status !== 204) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao excluir carro.');
    }

    showToast('Carro excluído com sucesso!', 'success');
    loadCars();
  } catch (error) {
    console.error(error);
    showToast(error.message, 'error');
  }
}

// =============================================
// 🎨 Funções de Renderização
// =============================================

/**
 * Renderiza a lista de carros como cards no grid.
 */
function renderCars(cars) {
  carsGrid.innerHTML = '';
  carCount.textContent = cars.length;

  if (cars.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  cars.forEach((car, index) => {
    const card = document.createElement('div');
    card.className = 'car-card';
    card.style.animationDelay = `${index * 0.08}s`;

    const imageHTML = car.foto
      ? `<img src="${escapeHTML(car.foto)}" alt="Foto do ${escapeHTML(car.marca)} ${escapeHTML(car.modelo)}" class="car-card__image" onerror="this.parentElement.innerHTML='<div class=\\'car-card__placeholder\\'>🚗</div>'" />`
      : `<div class="car-card__placeholder">🚗</div>`;

    const dateStr = car.criadoEm
      ? new Date(car.criadoEm).toLocaleDateString('pt-BR', {
          day: '2-digit', month: 'short', year: 'numeric',
        })
      : '';

    card.innerHTML = `
      <div class="car-card__image-wrapper">
        ${imageHTML}
      </div>
      <div class="car-card__body">
        <span class="car-card__brand">${escapeHTML(car.marca)}</span>
        <h3 class="car-card__model">${escapeHTML(car.modelo)}</h3>
        <p class="car-card__price">${formatPrice(car.preco)}</p>
        ${dateStr ? `<p class="car-card__date">Cadastrado em ${dateStr}</p>` : ''}
        <div class="car-card__actions">
          <button class="btn btn--edit" onclick='editCar(${JSON.stringify(car)})' aria-label="Editar ${escapeHTML(car.modelo)}">
            ✏️ Editar
          </button>
          <button class="btn btn--delete" onclick='deleteCar("${car._id}", "${escapeHTML(car.modelo)}")' aria-label="Excluir ${escapeHTML(car.modelo)}">
            🗑️ Excluir
          </button>
        </div>
      </div>
    `;

    carsGrid.appendChild(card);
  });
}

// =============================================
// 🛠️ Utilitários
// =============================================

/**
 * Formata número para moeda brasileira (R$).
 */
function formatPrice(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Escapa HTML para prevenir XSS.
 */
function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Exibe uma toast notification.
 */
function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast toast--${type} show`;

  // Remover toast após 3.5 segundos
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/**
 * Mostra/esconde o loading spinner.
 */
function showLoading(visible) {
  loadingEl.style.display = visible ? 'flex' : 'none';
  if (visible) {
    emptyState.style.display = 'none';
    carsGrid.innerHTML = '';
  }
}

/**
 * Mostra/esconde o loader no botão de submit.
 */
function setSubmitLoading(loading) {
  btnText.style.display = loading ? 'none' : 'inline';
  btnLoader.style.display = loading ? 'inline-block' : 'none';
  btnSubmit.disabled = loading;
}

/**
 * Reseta o formulário para o estado de criação.
 */
function resetForm() {
  carForm.reset();
  carIdInput.value = '';
  formTitle.textContent = 'Novo Carro';
  btnText.textContent = 'Cadastrar Carro';
  btnCancel.style.display = 'none';
}
