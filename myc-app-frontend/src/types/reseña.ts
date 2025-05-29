export interface PlatoConsumido {
    id: number | null;
    nombre: string;
}

export interface Reseña {
    _id?: string;
    cliente_id: number;
    fecha: string;
    tipo_visita: 'Desayuno' | 'Almuerzo' | 'Cena' | 'Evento' | 'Otro';
    platos_consumidos: { id: number; nombre: string }[];
    comentario: string;
    calificacion: number;
}
