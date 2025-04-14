<?php
// 允许跨域请求
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// 获取POST数据
$inputData = file_get_contents("php://input");
$postData = json_decode($inputData, true);

// 数据验证
if (!isset($postData['id']) || empty($postData['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => '缺少项目ID']);
    exit;
}

$projectId = $postData['id'];

// 读取现有项目数据
$jsonFile = 'projects.json';

if (!file_exists($jsonFile)) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => '数据文件不存在']);
    exit;
}

$jsonData = file_get_contents($jsonFile);
$existingData = json_decode($jsonData, true);

if (!is_array($existingData)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => '数据格式错误']);
    exit;
}

// 查找并删除项目
$found = false;
$newData = [];

foreach ($existingData as $project) {
    if ($project['id'] === $projectId) {
        $found = true;
    } else {
        $newData[] = $project;
    }
}

if (!$found) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => '找不到指定项目']);
    exit;
}

// 保存更新后的数据
$result = file_put_contents($jsonFile, json_encode($newData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

if ($result === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => '删除数据失败']);
    exit;
}

// 返回成功响应
http_response_code(200);
echo json_encode(['success' => true, 'message' => '项目已删除']);
?> 