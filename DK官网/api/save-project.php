<?php
// 允许跨域请求
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// 获取POST数据
$inputData = file_get_contents("php://input");
$postData = json_decode($inputData, true);

// 数据验证
if (
    !isset($postData['title']) || 
    !isset($postData['cover']) ||
    empty($postData['title']) ||
    empty($postData['cover'])
) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => '缺少必要数据']);
    exit;
}

// 读取现有项目数据
$jsonFile = 'projects.json';
$existingData = [];

if (file_exists($jsonFile)) {
    $jsonData = file_get_contents($jsonFile);
    $existingData = json_decode($jsonData, true);
    
    if (!is_array($existingData)) {
        $existingData = [];
    }
}

// 检查是新增还是更新
$projectId = $postData['id'] ?? null;
$isUpdate = false;
$updatedIndex = -1;

if ($projectId) {
    // 查找项目索引
    foreach ($existingData as $index => $project) {
        if ($project['id'] === $projectId) {
            $isUpdate = true;
            $updatedIndex = $index;
            break;
        }
    }
}

// 准备保存的数据
$projectData = [
    'id' => $projectId ?? uniqid(),
    'title' => $postData['title'],
    'category' => $postData['category'] ?? '未分类',
    'date' => $postData['date'] ?? date('Y年m月'),
    'client' => $postData['client'] ?? '',
    'cover' => $postData['cover'],
    'content' => $postData['content'] ?? '',
    'updatedAt' => date('c')
];

// 如果是新项目，添加创建时间
if (!$isUpdate) {
    $projectData['createdAt'] = date('c');
}

// 更新或添加项目数据
if ($isUpdate) {
    $existingData[$updatedIndex] = $projectData;
} else {
    $existingData[] = $projectData;
}

// 保存数据到JSON文件
$result = file_put_contents($jsonFile, json_encode($existingData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

if ($result === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => '保存数据失败']);
    exit;
}

// 返回成功响应
http_response_code(200);
echo json_encode(['success' => true, 'message' => $isUpdate ? '项目已更新' : '项目已添加', 'data' => $projectData]);
?> 