// ufoptions
export const ufOptions: { value: string; label: string }[] = [
  { value: '', label: 'Selecione' },
  { value: 'AC', label: 'AC' },
  { value: 'AL', label: 'AL' },
  { value: 'AM', label: 'AM' },
  { value: 'AP', label: 'AP' },
  { value: 'BA', label: 'BA' },
  { value: 'CE', label: 'CE' },
  { value: 'DF', label: 'DF' },
  { value: 'ES', label: 'ES' },
  { value: 'GO', label: 'GO' },
  { value: 'MA', label: 'MA' },
  { value: 'MG', label: 'MG' },
  { value: 'MS', label: 'MS' },
  { value: 'MT', label: 'MT' },
  { value: 'PA', label: 'PA' },
  { value: 'PB', label: 'PB' },
  { value: 'PE', label: 'PE' },
  { value: 'PI', label: 'PI' },
  { value: 'PR', label: 'PR' },
  { value: 'RJ', label: 'RJ' },
  { value: 'RN', label: 'RN' },
  { value: 'RO', label: 'RO' },
  { value: 'RR', label: 'RR' },
  { value: 'RS', label: 'RS' },
  { value: 'SC', label: 'SC' },
  { value: 'SE', label: 'SE' },
  { value: 'SP', label: 'SP' },
  { value: 'TO', label: 'TO' },
  { value: 'ND', label: 'ND' },
];

// parentesco
export const parentescoOptions: { value: string; label: string }[] = [
  { value: '', label: 'Selecione' },
  { value: '1', label: 'Filho(a)' },
  { value: '2', label: 'Cônjuge' },
  { value: '3', label: 'Pai' },
  { value: '4', label: 'Mãe' },
  { value: '5', label: 'Guarda' },
  { value: '6', label: 'Tutela' },
  { value: '7', label: 'Curadela' },
  { value: '8', label: 'Irmão(a)' },
  { value: '9', label: 'Sogro(a)' },
  { value: '10', label: 'Companheiro(a)' },
  { value: '11', label: 'Enteado(a)' },
  { value: '12', label: 'Outros' },
];

// escolaridade
export const escolaridadeOptions: { value: string; label: string }[] = [
  { value: '', label: 'Não definido' },
  { value: '1', label: 'Analfabeto' },
  { value: '2', label: 'Até à 4º série incompleta' },
  { value: '3', label: '4º série completa do ensino fundamental' },
  { value: '4', label: 'De 5º à 8º série do ensino fundamental' },
  { value: '5', label: 'Ensino fundamental completo' },
  { value: '6', label: 'Ensino médio incompleto' },
  { value: '7', label: 'Ensino médio completo' },
  { value: '8', label: 'Educação superior incompleta' },
  { value: '9', label: 'Educação superior completa' },
  { value: '10', label: 'Pós-Graduação' },
  { value: '11', label: 'Doutorado' },
  { value: '12', label: 'Segundo grau técnico incompleto' },
  { value: '13', label: 'Segundo grau técnico completo' },
  { value: '14', label: 'Mestrado' },
];

// estadocivil
export const estadoCivilOptions: { value: string; label: string }[] = [
  { value: '0', label: 'Solteiro' },
  { value: '1', label: 'Casado' },
  { value: '2', label: 'Sep.Judicialmente' },
  { value: '3', label: 'Divorciado' },
  { value: '4', label: 'Viúvo' },
];

// Tipo oções do formulario Plano-Ensino parte C
export const tipoCivilOptions: { value: string; label: string }[] = [
  { value: '0', label: 'ARTIGO DE PERÍODICO (ARTIGO)' },
  { value: '1', label: 'DOCUMENTOS ELETRÔNICOS' },
  {
    value: '2',
    label: 'MONOGRAFIA NO TODO (LIVROS, TRABALHOS ACADÉMICOS, ETC.)',
  },
  { value: '3', label: 'MATERIAIS ESPECIAIS (FITA, CD, DVD, MAPA)' },
  { value: '4', label: 'PERIÓDICO (REVISTAS, JORNAIS)' },
  { value: '5', label: 'PAGINAS WEB (SITES)' },
];
export const HoradaConsulta: { value: string; label: string }[] = [
  { value: '08:00', label: '08:00' },
  { value: '08:30', label: '08:30' },
  { value: '09:00', label: '09:00' },
  { value: '09:30', label: '09:30' },
  { value: '10:00', label: '10:00' },
  { value: '10:30', label: '10:30' },
  { value: '11:00', label: '11:00' },
  { value: '11:30', label: '11:30' },
  { value: '12:00', label: '12:00' },
  { value: '12:30', label: '12:30' },
  { value: '13:00', label: '13:00' },
  { value: '13:30', label: '13:30' },
  { value: '14:00', label: '14:00' },
  { value: '14:30', label: '14:30' },
  { value: '15:00', label: '15:00' },
  { value: '15:30', label: '15:30' },
  { value: '16:00', label: '16:00' },
  { value: '16:30', label: '16:30' },
];

export const EspecialidadeMedicas: { value: string; label: string }[] = [
  { value: '0', label: 'Cardiologia' },
  { value: '1', label: 'Dermatologia' },
  { value: '2', label: 'Endocrinologia' },
  { value: '3', label: 'Gastroenterologia' },
  { value: '4', label: 'Geriatria' },
  { value: '5', label: 'Ginecologia' },
  { value: '6', label: 'Hematologia' },
  { value: '7', label: 'Infectologia' },
  { value: '8', label: 'Nefrologia' },
  { value: '9', label: 'Neurologia' },
  { value: '10', label: 'Oftalmologia' },
  { value: '11', label: 'Oncologia' },
  { value: '12', label: 'Ortopedia' },
  { value: '13', label: 'Otorrinolaringologia' },
  { value: '14', label: 'Pediatria' },
  { value: '15', label: 'Psiquiatria' },
  { value: '16', label: 'Reumatologia' },
  { value: '17', label: 'Urologia' }
];


