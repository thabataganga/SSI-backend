const { buildTipo , buildTipoConvite} = require("../UsuarioBuildTypes")
describe('Usuarios TIPOS - BUILDER', () => {

    test('devo criar um tipo de usuario afiliado a partir de membro', () => {
        const instituicao_tipo = "SINDICATO"
        const usuario_tipo = "MEMBRO"

        const tipo = buildTipo(usuario_tipo, instituicao_tipo)

        expect(tipo).toEqual("FILIADO");
    });

    test('devo criar um tipo de usuario associado a partir de FILIADO', () => {
        const instituicao_tipo = "SINDICATO"
        const usuario_tipo = "FILIADO"

        const tipo = buildTipo(usuario_tipo, instituicao_tipo)

        expect(tipo).toEqual("FILIADO");
    });

    test('devo criar um tipo de usuario associado a partir de membro', () => {
        const instituicao_tipo = "CANDIDATURA"
        const usuario_tipo = "MEMBRO"

        const tipo = buildTipo(usuario_tipo, instituicao_tipo)

        expect(tipo).toEqual("ASSOCIADO");
    });

    test('devo criar um tipo de usuario associado a partir de ASSOCIADO', () => {
        const instituicao_tipo = "CANDIDATURA"
        const usuario_tipo = "ASSOCIADO"

        const tipo = buildTipo(usuario_tipo, instituicao_tipo)

        expect(tipo).toEqual("ASSOCIADO");
    });

    test('devo criar um tipo de usuario associado a partir de ASSOCIADO', () => {
        const instituicao_tipo = "CANDIDATURA"
        const usuario_tipo = "ASSOCIADO"

        const tipo = buildTipo(usuario_tipo, instituicao_tipo)

        expect(tipo).toEqual("ASSOCIADO");
    });

    test('devo criar um tipo de usuario colaborador a partir de admin', () => {
        const instituicao_tipo = "CANDIDATURA"
        const usuario_tipo = "COLABORADOR"

        const tipo = buildTipo(usuario_tipo, instituicao_tipo)

        expect(tipo).toEqual("COLABORADOR");
    });

    test('devo criar um tipo de usuario colaborador a partir de COLABORADOR', () => {
        const instituicao_tipo = "CANDIDATURA"
        const usuario_tipo = "COLABORADOR"

        const tipo = buildTipo(usuario_tipo, instituicao_tipo)

        expect(tipo).toEqual("COLABORADOR");
    });


    test('devo criar um tipo de usuario colaborador a partir de ADMIN', () => {
        const instituicao_tipo = "CANDIDATURA"
        const usuario_tipo = "COLABORADOR"

        const tipo = buildTipo(usuario_tipo, instituicao_tipo)

        expect(tipo).toEqual("COLABORADOR");
    });

    describe('Erros - BUILD - USUARIO TIPOS', () => {

        test('deve dar erro ao passar um tipo de usuario invalido', () => {
            const instituicao_tipo = "CANDIDATURA"
            const usuario_tipo = "ILARIEOHOHOHO!"

            expect(Throw(() => {
                buildTipo(usuario_tipo, instituicao_tipo)
            })).toBe(true)
        });
    });
});

const Throw = (fn, expectedValue) => {
    try {
        fn()
    } catch (error) {
        if (!expectedValue) return true
        else return error.message || error == expectedValue
    }
}