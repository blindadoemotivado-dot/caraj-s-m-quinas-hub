## Problema

Clicar em "Ver detalhes" muda a URL para `/machines/:id` mas a página de detalhes não aparece.

**Causa:** Pela convenção de nomes do TanStack Router, `machines.$id.tsx` é tratado como **rota filha** de `machines.tsx`. Como `machines.tsx` não renderiza `<Outlet />`, a rota filha casa mas nada é exibido — o usuário continua vendo o catálogo.

## Correção

Renomear o arquivo da página de detalhes para sair do aninhamento de layout, usando o sufixo `_` (que opta por sair do layout pai no TanStack Router):

- `src/routes/machines.$id.tsx` → `src/routes/machines_.$id.tsx`

A URL pública continua sendo `/machines/:id`, e nenhum `<Link to="/machines/$id" params={{ id }}>` precisa ser alterado. O `routeTree.gen.ts` é regenerado automaticamente pelo plugin do Vite.

## Verificação

Após o rename, abrir o preview, clicar em "Ver detalhes" em qualquer card (home ou catálogo) e confirmar que a página de detalhes em fundo preto (#0D0D0D) carrega corretamente.
