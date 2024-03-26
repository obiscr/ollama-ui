import React from "react";
import {
    Avatar,
    Code,
    Link,
    Spinner,
    Table, TableBody,
    TableCell,
    TableColumn,
    TableHeader, TableRow
} from "@nextui-org/react";
import Markdown from "react-markdown";
import remarkDirective from "remark-directive";
import rehypeRaw from "rehype-raw";
import remarkDirectiveRehype from "remark-directive-rehype";
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import rehypeStringify from "rehype-stringify";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import useTheme from 'next-theme'

interface AIMessageProps {
    content: string;
}

const AiMessage: React.FC<AIMessageProps>  = ({ content }) => {
    const { theme } = useTheme();
    const EmptyTable = () => {
        return (
            <Table hideHeader aria-label="Markdown Table">
                <TableHeader>
                    <TableColumn>Key</TableColumn>
                    <TableColumn>Value</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"Invalid table format"}>{[]}</TableBody>
            </Table>
        )
    }

    return (
        <div className="flex gap-3">
            <div className="relative flex-none">
                <Avatar src="https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatar_ai.png"/>
            </div>
            {
                content ? (
                    <div className="flex w-full flex-col gap-4">
                        <div className="relative w-full rounded-medium bg-content2 px-4 py-3 text-default-600">
                            <div className="text-small markdown-body">
                                <Markdown remarkPlugins={[remarkDirective,remarkDirectiveRehype]}
                                          rehypePlugins={[rehypeRaw, remarkGfm, remarkParse, rehypeStringify]}
                                          components={{
                                              a: (props) => {
                                                  const {node, href, children, ...rest}  = props
                                                  return (
                                                      <Link size="sm" href={href} target="_blank">{children}</Link>
                                                  );
                                              },
                                              blockquote(props){
                                                  return (
                                                      <blockquote {...props} className="text-default-500" style={{margin: "0", padding: "0 0.5em", borderLeft: "0.25em solid #AFB1B3"}}>{props.children}</blockquote>
                                                  )
                                              },
                                              h1(props){
                                                  return (
                                                      <h1>{props.children}</h1>
                                                  )
                                              },
                                              h2(props){
                                                  return (
                                                      <h2>{props.children}</h2>
                                                  )
                                              },
                                              p(props){
                                                  return (
                                                      <p className="mb-3">{props.children}</p>
                                                  )
                                              },
                                              ul(props){
                                                  return (
                                                      <ul style={{listStyleType: "disc", paddingLeft: "2em"}}>{props.children}</ul>
                                                  )
                                              },
                                              li(props){
                                                  return (
                                                      <li className="mt-1 mb-1">{props.children}</li>
                                                  )
                                              },
                                              table(props){
                                                  const { children, node } = props
                                                  if (!node) {
                                                      return (
                                                          <EmptyTable />
                                                      )
                                                  }
                                                  const thead: any = node.children.find((child: any )=> child.tagName === 'thead');
                                                  const tbody: any = node.children.find((child: any )=> child.tagName === 'tbody');

                                                  if (!thead || !tbody) {
                                                    return <Code size="sm" style={{color: "inherit"}}>Invalid table format</Code>
                                                  }

                                                  try {
                                                      const headerCells = thead.children[0].children.map((th: any, index: number) => (
                                                          <TableColumn key={index}>{th.children[0].value}</TableColumn>
                                                      ));

                                                      const bodyRows = tbody.children.map((tr: any, rowIndex: number) => (
                                                          <TableRow key={rowIndex}>
                                                              {tr.children.map((td: any, cellIndex: number) => (
                                                                  <TableCell key={cellIndex}>{td.children[0].value}</TableCell>
                                                              ))}
                                                          </TableRow>
                                                      ));

                                                      return (
                                                          <Table isStriped aria-label="Markdown Table">
                                                              <TableHeader>
                                                                  {headerCells}
                                                              </TableHeader>
                                                              <TableBody>
                                                                  {bodyRows}
                                                              </TableBody>
                                                          </Table>
                                                      )
                                                  } catch (e) {
                                                      return (
                                                          <EmptyTable />
                                                      )
                                                  }
                                              },
                                              code(props) {
                                                  const {children, className, node, ...rest} = props
                                                  const hasLang = /language-(\w+)/.exec(className || "");
                                                  return hasLang ? (
                                                      <SyntaxHighlighter
                                                          style={oneDark}
                                                          language={hasLang[1]}
                                                          PreTag="div"
                                                          className="mockup-code scrollbar-thin scrollbar-track-base-content/5 scrollbar-thumb-base-content/40 scrollbar-track-rounded-md scrollbar-thumb-rounded"
                                                          showLineNumbers={true}
                                                          useInlineStyles={true}
                                                      >
                                                          {String(props.children).replace(/\n$/, "")}
                                                      </SyntaxHighlighter>
                                                  ) : (
                                                      <Code size="sm" className="whitespace-normal" style={{color: "inherit"}}>
                                                          {children}
                                                      </Code>
                                                  )
                                              }
                                          }}>
                                    {content}
                                </Markdown>
                            </div>
                        </div>
                    </div>
                ): (
                    <Spinner />
                )
            }
        </div>
    )
}

export default AiMessage;
