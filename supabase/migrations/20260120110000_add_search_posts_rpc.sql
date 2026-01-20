-- RPC 함수: title, excerpt, tags 통합 검색 (보안 강화)
-- 일반 사용자는 is_published=true만 조회 가능, 관리자는 모든 게시글 조회 가능
CREATE OR REPLACE FUNCTION search_posts(
  p_search TEXT DEFAULT NULL,
  p_post_type TEXT DEFAULT NULL,
  p_is_published BOOLEAN DEFAULT NULL,
  p_category_id UUID DEFAULT NULL,
  p_limit INT DEFAULT 10,
  p_offset INT DEFAULT 0,
  p_sort_by TEXT DEFAULT 'date',
  p_sort_direction TEXT DEFAULT 'desc'
)
RETURNS JSON AS $$
DECLARE
  v_total BIGINT;
  v_result JSON;
  v_is_admin BOOLEAN;
  v_is_published_filter BOOLEAN;
BEGIN
  -- 관리자 여부 확인
  v_is_admin := (SELECT public.is_admin());

  -- 관리자가 아니면 강제로 is_published = true만 조회
  IF v_is_admin THEN
    v_is_published_filter := p_is_published;
  ELSE
    v_is_published_filter := true;
  END IF;

  -- Count 쿼리
  SELECT COUNT(*) INTO v_total
  FROM posts p
  WHERE
    (p_post_type IS NULL OR p.post_type = p_post_type)
    AND (v_is_published_filter IS NULL OR p.is_published = v_is_published_filter)
    AND (p_category_id IS NULL OR p.category_id = p_category_id)
    AND (
      p_search IS NULL
      OR p.title ILIKE '%' || p_search || '%'
      OR p.excerpt ILIKE '%' || p_search || '%'
      OR EXISTS (
        SELECT 1 FROM unnest(p.tags) AS tag
        WHERE tag ILIKE '%' || p_search || '%'
      )
    );

  -- Data 쿼리 with category join
  SELECT json_build_object(
    'data', COALESCE(json_agg(row_to_json(t)), '[]'::json),
    'total', v_total
  ) INTO v_result
  FROM (
    SELECT
      p.id,
      p.title,
      p.excerpt,
      p.image_url,
      p.post_type,
      p.category_id,
      p.tags,
      p.date,
      p.is_published,
      p.views,
      p.client_name,
      p.client_company,
      p.client_position,
      p.rating,
      p.created_at,
      p.updated_at,
      c.name AS category_name
    FROM posts p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE
      (p_post_type IS NULL OR p.post_type = p_post_type)
      AND (v_is_published_filter IS NULL OR p.is_published = v_is_published_filter)
      AND (p_category_id IS NULL OR p.category_id = p_category_id)
      AND (
        p_search IS NULL
        OR p.title ILIKE '%' || p_search || '%'
        OR p.excerpt ILIKE '%' || p_search || '%'
        OR EXISTS (
          SELECT 1 FROM unnest(p.tags) AS tag
          WHERE tag ILIKE '%' || p_search || '%'
        )
      )
    ORDER BY
      CASE WHEN p_sort_direction = 'desc' AND p_sort_by = 'date' THEN p.date END DESC,
      CASE WHEN p_sort_direction = 'asc' AND p_sort_by = 'date' THEN p.date END ASC,
      CASE WHEN p_sort_direction = 'desc' AND p_sort_by = 'views' THEN p.views END DESC,
      CASE WHEN p_sort_direction = 'asc' AND p_sort_by = 'views' THEN p.views END ASC
    LIMIT p_limit
    OFFSET p_offset
  ) t;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
