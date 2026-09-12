export interface ModelProps {
  /** color principal del cuerpo */
  body: string;
  /** color de las piezas de contraste: llantas, franjas, alerones */
  accent: string;
  /** color del metacrilato y las piezas translúcidas */
  extra: string;
  /** grados de giro acumulados, para ruedas, hélices y piezas que rotan */
  spin?: number;
}
