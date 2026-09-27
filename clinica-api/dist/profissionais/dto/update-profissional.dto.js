"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfissionalDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_profissional_dto_1 = require("./create-profissional.dto");
class UpdateProfissionalDto extends (0, mapped_types_1.PartialType)(create_profissional_dto_1.CreateProfissionalDto) {
}
exports.UpdateProfissionalDto = UpdateProfissionalDto;
//# sourceMappingURL=update-profissional.dto.js.map