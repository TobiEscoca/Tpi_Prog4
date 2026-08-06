export const ROLES = [
  { value: 'Cliente', label: 'Cliente' },
  { value: 'DuenoComplejo', label: 'Dueño de complejo' },
  { value: 'AdministradorGeneral', label: 'Administrador' },
]

export const rolLabel = (rol) => {
  const found = ROLES.find((r) => r.value === rol)
  return found ? found.label : rol
}

export const ROL_COLORS = {
  Cliente: 'bg-blue-100 text-blue-700',
  DuenoComplejo: 'bg-purple-100 text-purple-700',
  AdministradorGeneral: 'bg-green-100 text-green-700',
}
