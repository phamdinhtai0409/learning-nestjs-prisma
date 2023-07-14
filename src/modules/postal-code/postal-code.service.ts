import { BadRequestException, Injectable } from "@nestjs/common";
import { Oaza } from "jp-zipcode-lookup";

import { PostalCodeResponseDTO } from "modules/postal-code/dtos/postal-code-response.dto";

@Injectable()
export class PostalCodeService {
  constructor() {
  }

  postalCodeAPI = "https://madefor.github.io/postal-code-api/api/v1/";

  async getAddress(postalCode: string): Promise<PostalCodeResponseDTO> {
    return new Promise((resolve) => {
      fetch(this.makeRequestURL(this.sanitize(postalCode)))
        .then((res) => {
          if (!res.ok) throw new BadRequestException();
          return res.json();
        })
        .then((data) => {
          let address = "";
          const jpData = data.data[0]?.ja;
          if (jpData) {
            const { address1, address2, address3, address4 } = jpData;
            address = `${address1}${address2}${address3}${address4}`;
          }

          resolve({ code: postalCode, address });
        })
        .catch(() => {
          // call fallback
          // use static data from jp-zipcode-lookup lib
          let address = "";
          const data = Oaza.byZipcode(postalCode)[0];
          if (data) {
            address = `${data.city.name}${data.name}`;
          }
          resolve({ code: postalCode, address });
        });
    });
  }

  sanitize = (code: string | number): [string, string] => {
    const sanitized = `${code}`
      .replace(/[^0-9０-９]/g, "")
      .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0));

    return [sanitized.slice(0, 3), sanitized.slice(3, 7)];
  };

  makeRequestURL = ([first, second]: [string, string]): string =>
    `${this.postalCodeAPI}${first}/${second}.json`;

}
