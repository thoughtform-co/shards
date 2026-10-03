import { cardById, charges, heroDocument, month, vendorById } from "@/content/folio";

/*
 * One MCP call and its answer, written from the dataset: the record Folio
 * keeps per charge, as an agent receives it.
 */
export function CodeSample() {
  const d = heroDocument;
  const v = vendorById(d.vendorId);
  const card = cardById(d.card);
  const receipt = charges.find((c) => c.doc.kind === "receipt");
  const rv = receipt ? vendorById(receipt.vendorId) : null;
  const amount = (d.cents / 100).toFixed(2);

  return (
    <div className="fo-code fo-mock" data-mock="code">
      <div className="fo-code__bar">
        <span className="is-active">list_documents</span>
        <span>get_document</span>
        <span>missing</span>
        <span>deliver</span>
      </div>
      <pre>
        <span className="c">{"// your agent calls"}</span>
        {"\n"}
        <span className="p">folio</span>.<span className="f">list_documents</span>({"{ "}
        <span className="k">period</span>: <span className="s">&quot;2026-09&quot;</span>, <span className="k">card</span>:{" "}
        <span className="s">&quot;{card.last4}&quot;</span>
        {" })"}
        {"\n\n"}
        <span className="c">{"// Folio answers"}</span>
        {"\n{\n  "}
        <span className="k">&quot;charges&quot;</span>: <span className="n">{month.charges}</span>,{"\n  "}
        <span className="k">&quot;documents&quot;</span>: [{"\n    {\n      "}
        <span className="k">&quot;vendor&quot;</span>: <span className="s">&quot;{v.legalName}&quot;</span>,{"\n      "}
        <span className="k">&quot;kind&quot;</span>: <span className="s">&quot;{d.doc.kind}&quot;</span>,{"\n      "}
        <span className="k">&quot;number&quot;</span>: <span className="s">&quot;{d.doc.number}&quot;</span>,{"\n      "}
        <span className="k">&quot;issued&quot;</span>: <span className="s">&quot;{d.date}&quot;</span>,{"\n      "}
        <span className="k">&quot;amount&quot;</span>: {"{ "}
        <span className="k">&quot;value&quot;</span>: <span className="n">{amount}</span>, <span className="k">&quot;currency&quot;</span>:{" "}
        <span className="s">&quot;{d.currency}&quot;</span>
        {" }"},{"\n      "}
        <span className="k">&quot;vat&quot;</span>: <span className="s">&quot;reverse_charge&quot;</span>,{"\n      "}
        <span className="k">&quot;paid_with&quot;</span>: <span className="s">&quot;{card.brand.toLowerCase()}_{card.last4}&quot;</span>,{"\n      "}
        <span className="k">&quot;pdf&quot;</span>: <span className="s">&quot;folio://docs/{d.doc.number}.pdf&quot;</span>
        {"\n    },\n    "}
        <span className="c">{`// ${month.invoices + month.receipts - 1} more`}</span>
        {"\n  ],\n  "}
        <span className="k">&quot;missing&quot;</span>: [
        {rv && receipt ? (
          <>
            {"{ "}
            <span className="k">&quot;vendor&quot;</span>: <span className="s">&quot;{rv.name}&quot;</span>, <span className="k">&quot;reason&quot;</span>:{" "}
            <span className="s">&quot;receipt_only&quot;</span>
            {" }"}
          </>
        ) : null}
        ]{"\n}"}
      </pre>
    </div>
  );
}
