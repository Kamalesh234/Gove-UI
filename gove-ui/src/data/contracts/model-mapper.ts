
/*
* Interface of a Mapper, to change a value into other.
*/
export interface Mapper<Input, Output> {
  map: (input: Input) => Output;
  mapArray?: (input: Input[]) => Output[];
}

/*
* Interface of a ComplexMapper, to change a value into other.
*/
export interface ComplexMapper<Input, Output, Property> {
  map: (input: Property) => Property;
  mapArray?: (input: Property[]) => Property[];
  mapComplexObject?: (input: Input) => Output;
}
