export interface PeopleDataJson {
  imie: string;
  nazwisko: string;
  o_mnie: string;
  wiek: string;
  ulubiona_postac_z_kapitana_bomby: string;
  ulubiony_film: string;
  ulubiony_kolor: string;
  ulubiony_serial: string;
}

export interface QuestionInterface {
  name: string;
  key: keyof PeopleDataJson;
}
