import json
import sys

INPUT_FILE = "/app/input.json"
OUTPUT_FILE = "/app/output.json"

try: 
    with open(INPUT_FILE, "r") as f:
        data = json.load(f)
    
    code = data["code"]
    function_name = data["functionName"]
    test_cases = data["testCases"]

    local_scope = {}

    exec(code, {}, local_scope)

    passed = 0
    results = []

    for test in test_cases:
        args = eval(test["input"])
        expected = json.load(test["expectedOutput"])

        output = local_scope[function_name](*args)

        is_correct = output == expected
        if is_correct:
            passed += 1

        results.append({
            "input": test["input"],
            "expected": expected,
            "output": output,
            "passed": is_correct
        })

    with open(OUTPUT_FILE, "w") as f:
        json.dump({
            "passed": passed,
            "total": len(test_cases),
            "results": results
        }, f)

except Exception as e:
    with open(OUTPUT_FILE, "w") as f:
        json.dump({ "error": str(e) }, f)