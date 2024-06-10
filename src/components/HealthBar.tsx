import { FunctionComponent } from "preact";
import { Ticker, Tick } from "react-flip-ticker";
import { maxHealth } from "../app";

export const HealthBar: FunctionComponent<{ value: number; }> = ( { value } ) =>
{
  const HEX_DIGITS = '0123456789ABCDEFNa-/'.split( '' );
  const valueHex = isNaN( value ) ? 'NaN' : value.toString( 16 ).toUpperCase().padStart( 6, '0' );
  const hpPercentage = isNaN( value ) ? 0 : ( 100 * value ) / maxHealth; // Ensure value is a number

  return (
    <div class='hp-container'>
      <div class='hp-bar' style={ { width: `${ hpPercentage }%` } }></div>
      <div class='hp-ticker'>
        <Ticker textClassName='text'>
          ♥
          { valueHex.split( '' ).map( ( char, index ) => (
            <Tick key={ 'd' + index } rotateItems={ HEX_DIGITS }>
              { char }
            </Tick>
          ) ) }
        </Ticker>
      </div>
    </div>
  );
};
