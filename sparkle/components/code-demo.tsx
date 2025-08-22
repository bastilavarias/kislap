"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export function CodeDemo() {
  const [typedLines, setTypedLines] = useState<number[]>([])

  const codeLines = [
    {
      line: 1,
      content: (
        <>
          <span className="text-purple-400">use</span> <span className="text-blue-400">std::io</span>;
        </>
      ),
    },
    { line: 2, content: <></> },
    {
      line: 3,
      content: (
        <>
          <span className="text-purple-400">fn</span> <span className="text-yellow-400">main</span>() {"{"}
        </>
      ),
    },
    {
      line: 4,
      content: (
        <span className="ml-4">
          <span className="text-blue-400">println!</span>(<span className="text-green-400">"Welcome to Zed!"</span>);
        </span>
      ),
    },
    { line: 5, content: <span className="ml-4"></span> },
    {
      line: 6,
      content: (
        <span className="ml-4">
          <span className="text-purple-400">let</span> <span className="text-blue-300">input</span> ={" "}
          <span className="text-blue-400">io::stdin</span>()
        </span>
      ),
    },
    {
      line: 7,
      content: (
        <span className="ml-8">
          .<span className="text-yellow-400">read_line</span>(&<span className="text-purple-400">mut</span>{" "}
          <span className="text-blue-300">String::new</span>())
        </span>
      ),
    },
    {
      line: 8,
      content: (
        <span className="ml-8">
          .<span className="text-yellow-400">expect</span>(
          <span className="text-green-400">"Failed to read input"</span>);
        </span>
      ),
    },
    { line: 9, content: <>{"}"}</> },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setTypedLines((prev) => {
        if (prev.length < codeLines.length) {
          return [...prev, prev.length]
        }
        return prev
      })
    }, 300)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="bg-card border-border overflow-hidden">
            <motion.div
              className="bg-muted/50 px-4 py-2 border-b border-border flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {["bg-red-500", "bg-yellow-500", "bg-green-500"].map((color, index) => (
                    <motion.div
                      key={color}
                      className={`w-3 h-3 ${color} rounded-full`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground ml-4">main.rs</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>Rust</span>
                <span>•</span>
                <span>UTF-8</span>
              </div>
            </motion.div>

            <div className="p-6 font-mono text-sm">
              <div className="space-y-1">
                {codeLines.map((codeLine, index) => (
                  <motion.div
                    key={codeLine.line}
                    className="flex"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: typedLines.includes(index) ? 1 : 0.3,
                      x: typedLines.includes(index) ? 0 : -20,
                    }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1,
                    }}
                  >
                    <span className="text-muted-foreground w-8 text-right mr-4">{codeLine.line}</span>
                    <span>{codeLine.content}</span>
                    {typedLines.length === index && (
                      <motion.span
                        className="inline-block w-2 h-5 bg-accent ml-1"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-4 pt-4 border-t border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3, duration: 0.5 }}
              >
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <motion.div
                      className="w-2 h-2 bg-green-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                    <span>No errors</span>
                  </span>
                  <span>•</span>
                  <span>9 lines</span>
                  <span>•</span>
                  <span>Built in 0.12s</span>
                </div>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
