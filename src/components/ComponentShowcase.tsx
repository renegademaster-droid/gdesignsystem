/**
 * GDS – Design system -esittelysivu.
 * Komponentit ja teema GDS:stä; tyylit Figmasta.
 */
import {
  AbsoluteCenter,
  Accordion,
  ActionBar,
  Alert,
  AspectRatio,
  Avatar,
  Badge,
  Bleed,
  Blockquote,
  Box,
  Breadcrumb,
  Button,
  ButtonGroup,
  Card,
  Carousel,
  Center,
  Checkbox,
  CheckboxCard,
  Circle,
  Clipboard,
  Code,
  Collapsible,
  ColorPicker,
  ColorSwatch,
  Combobox,
  Container,
  createListCollection,
  createTreeCollection,
  Dialog,
  Drawer,
  Editable,
  EmptyState,
  Field,
  Fieldset,
  FileUpload,
  Flex,
  Float,
  For,
  Grid,
  Group,
  Heading,
  Highlight,
  HoverCard,
  Image,
  Input,
  InputGroup,
  Kbd,
  Link,
  List,
  Loader,
  Menu,
  NativeSelect,
  NumberInput,
  Pagination,
  PinInput,
  Popover,
  Progress,
  ProgressCircle,
  QrCode,
  RadioCard,
  RadioGroup,
  RatingGroup,
  ScrollArea,
  SegmentGroup,
  Select,
  Separator,
  SimpleGrid,
  Skeleton,
  Slider,
  Spacer,
  Spinner,
  Square,
  Stack,
  Stat,
  Status,
  Steps,
  Sticky,
  Strong,
  Switch,
  Table,
  Tabs,
  Tag,
  TagsInput,
  Text,
  Textarea,
  Timeline,
  Toggle,
  Tooltip,
  TreeView,
  useFilter,
  useListCollection,
  VisuallyHidden,
  Wrap,
  CloseButton,
  IconButton,
  HStack,
  VStack,
  Portal,
} from "@chakra-ui/react"
import { createContext, useContext } from "react"
import { Link as RouterLink, useParams } from "react-router-dom"
import { ColorModeButton } from "@/components/ui/color-mode"
import { Icon } from "@/components/icons"
import { toaster } from "@/components/ui/toaster"

const ShowcaseContext = createContext<{ routeId: string | undefined }>({ routeId: undefined })

const selectFrameworks = createListCollection({
  items: [
    { label: "React.js", value: "react" },
    { label: "Vue.js", value: "vue" },
    { label: "Angular", value: "angular" },
    { label: "Svelte", value: "svelte" },
  ],
})

const comboboxFrameworks = [
  { label: "React", value: "react" },
  { label: "Solid", value: "solid" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
]

interface TreeNode {
  id: string
  name: string
  children?: TreeNode[]
}
const treeCollection = createTreeCollection<TreeNode>({
  nodeToValue: (node) => node.id,
  nodeToString: (node) => node.name,
  rootNode: {
    id: "ROOT",
    name: "",
    children: [
      {
        id: "src",
        name: "src",
        children: [
          { id: "src/app", name: "app.tsx" },
          { id: "src/index", name: "index.ts" },
        ],
      },
      { id: "package", name: "package.json" },
      { id: "readme", name: "README.md" },
    ],
  },
})

function ComboboxExample() {
  const { contains } = useFilter({ sensitivity: "base" })
  const { collection, filter } = useListCollection({
    initialItems: comboboxFrameworks,
    filter: contains,
  })
  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={(e) => filter(e.inputValue)}
      width="320px"
      colorPalette="brand"
    >
      <Combobox.Label>Etsi framework</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Kirjoita hakusana..." />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>Ei tuloksia</Combobox.Empty>
            {collection.items.map((item) => (
              <Combobox.Item item={item} key={item.value}>
                {item.label}
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

/** Komponentin nimestä scroll-attribuuttia varten id (esim. "Circle / Square" → "circle-square"). */
function nameToId(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s*\/\s*/g, " ")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "component"
}

/** Navigaation rakenne: jokainen osio ja sen komponentit. */
const NAV_SECTIONS: { section: string; cards: string[] }[] = [
  {
    section: "Layout",
    cards: [
      "AbsoluteCenter",
      "AspectRatio",
      "Bleed",
      "Box",
      "Center",
      "Circle / Square",
      "Container",
      "Float",
      "Flex",
      "Grid",
      "HStack / VStack",
      "ScrollArea",
      "SimpleGrid",
      "Spacer",
      "Stack",
      "Sticky",
      "Wrap",
      "Carousel",
    ],
  },
  { section: "Button & Link", cards: ["Button", "ButtonGroup", "CloseButton", "Link"] },
  { section: "Icons (GDS)", cards: ["Icon – Figma-väritokenit"] },
  {
    section: "Form",
    cards: [
      "Checkbox",
      "Editable",
      "Field",
      "FileUpload",
      "Input",
      "InputGroup",
      "NativeSelect",
      "Select (collection)",
      "NumberInput",
      "PinInput",
      "RadioGroup",
      "Slider",
      "Switch",
      "TagsInput",
      "Textarea",
      "CheckboxCard",
      "Fieldset",
      "RadioCard",
    ],
  },
  {
    section: "Data display",
    cards: [
      "Avatar",
      "Badge",
      "Blockquote",
      "Card",
      "Code",
      "Highlight",
      "Image",
      "Kbd",
      "List",
      "Stat",
      "Status",
      "Table",
      "Tag",
    ],
  },
  {
    section: "Feedback",
    cards: [
      "Alert",
      "EmptyState",
      "Loader",
      "QrCode",
      "Timeline",
      "Progress",
      "ProgressCircle",
      "Skeleton",
      "Spinner",
    ],
  },
  {
    section: "Overlay",
    cards: ["Dialog", "Drawer", "HoverCard", "Menu", "Popover", "Toggle", "Tooltip"],
  },
  {
    section: "Navigation",
    cards: ["Accordion", "Breadcrumb", "Pagination", "Steps", "Tabs"],
  },
  {
    section: "Misc",
    cards: ["ActionBar", "Collapsible", "Group", "Separator", "Clipboard"],
  },
  { section: "Typography", cards: ["Heading", "Strong", "Text"] },
  {
    section: "More",
    cards: [
      "ColorPicker",
      "ColorSwatch",
      "RatingGroup",
      "SegmentGroup",
      "Show (conditional)",
      "Splitter",
      "TreeView",
      "DatePicker",
      "Combobox",
      "Listbox",
      "CodeBlock",
      "Marquee",
      "Prose",
      "Toast / Toaster",
      "SkipNav",
      "Overlay",
      "DownloadTrigger",
      "Charts (AreaChart, BarChart, …)",
      "VisuallyHidden",
    ],
  },
]

function ComponentSection({
  title,
  cardIds,
  children,
}: {
  title: string
  cardIds?: string[]
  children: React.ReactNode
}) {
  const { routeId } = useContext(ShowcaseContext)
  const visible = !routeId || (cardIds != null && cardIds.includes(routeId))
  if (!visible) return null
  return (
    <Box>
      <Heading size="md" mb="3" color="fg.muted">
        {title}
      </Heading>
      <Stack gap="4" mb="8">
        {children}
      </Stack>
    </Box>
  )
}

function ComponentCard({
  name,
  children,
}: {
  name: string
  children: React.ReactNode
}) {
  const { routeId } = useContext(ShowcaseContext)
  const id = nameToId(name)
  const visible = !routeId || routeId === id
  if (!visible) return null
  return (
    <Box id={id} scrollMarginTop="6rem">
      <Card.Root size="sm" variant="outline">
        <Card.Body gap="2">
          <Text textStyle="sm" fontWeight="medium" color="fg.muted">
            {name}
          </Text>
          <Box>{children}</Box>
        </Card.Body>
      </Card.Root>
    </Box>
  )
}

export function ComponentShowcase() {
  const { id: routeId } = useParams()
  return (
    <ShowcaseContext.Provider value={{ routeId }}>
    <Flex minH="100vh" bg="bg.default">
      {/* Vasen navigaatio */}
      <Box
        as="nav"
        width="240px"
        flexShrink={0}
        borderRightWidth="1px"
        borderColor="border.subtle"
        bg="bg.subtle"
        position="sticky"
        top="0"
        height="100vh"
        overflowY="auto"
      >
        <Box p="4">
          <Box
            mb="3"
            fontSize="sm"
            fontWeight="semibold"
            color={routeId ? "fg.muted" : "fg.default"}
            _hover={{ color: "fg.default" }}
          >
            <RouterLink to="/" style={{ color: "inherit", textDecoration: "none" }}>
              Kaikki komponentit
            </RouterLink>
          </Box>
          <Heading size="sm" mb="3" color="fg.muted">
            Komponentit
          </Heading>
          <VStack gap="4" align="stretch">
            {NAV_SECTIONS.map(({ section, cards }) => (
              <Box key={section}>
                <Text
                  textStyle="xs"
                  fontWeight="semibold"
                  color="fg.muted"
                  mb="2"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  {section}
                </Text>
                <VStack gap="1" align="stretch">
                  {cards.map((cardName) => (
                    <Box
                      key={cardName}
                      py="1"
                      px="2"
                      rounded="md"
                      fontSize="sm"
                      color={routeId === nameToId(cardName) ? "brand.solid" : "fg.muted"}
                      _hover={{ color: "fg.default", textDecoration: "underline" }}
                    >
                      <RouterLink
                        to={`/components/${nameToId(cardName)}`}
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        {cardName}
                      </RouterLink>
                    </Box>
                  ))}
                </VStack>
              </Box>
            ))}
          </VStack>
        </Box>
      </Box>

      {/* Pääsisältö */}
      <Box flex="1" minW="0">
        <Box p="8" maxW="6xl" mx="auto">
          <Flex align="center" justify="space-between" gap="4" mb="8" wrap="wrap">
            <Box>
              <Heading size="lg" mb="2">
                GDS – Design system
              </Heading>
              <Text color="fg.muted">
                Komponentit ja teema tulevat GDS:stä. Tyylit (värit, typografia, spacing, radii) haetaan ja ylläpidetään Figmassa.
              </Text>
            </Box>
            <HStack gap="2" align="center">
              <Text textStyle="sm" color="fg.muted">
                Teema
              </Text>
              <ColorModeButton aria-label="Vaihda teema (light / dark)" />
            </HStack>
          </Flex>

      <ComponentSection title="Layout: Box, Flex, Grid, Stack, Center" cardIds={NAV_SECTIONS[0].cards.map(nameToId)}>
        <ComponentCard name="AbsoluteCenter">
          <Box pos="relative" h="20" bg="bg.subtle" rounded="md">
            <AbsoluteCenter>AbsoluteCenter</AbsoluteCenter>
          </Box>
        </ComponentCard>
        <ComponentCard name="AspectRatio">
          <AspectRatio ratio={16 / 9}>
            <Box bg="bg.subtle" rounded="md" />
          </AspectRatio>
        </ComponentCard>
        <ComponentCard name="Bleed">
          <Bleed inline="4">
            <Box p="2" bg="red.subtle" rounded="sm">
              Bleed
            </Box>
          </Bleed>
        </ComponentCard>
        <ComponentCard name="Box">
          <Box p="4" bg="bg.muted" rounded="md">
            Box
          </Box>
        </ComponentCard>
        <ComponentCard name="Center">
          <Center h="12" bg="bg.muted" rounded="md">
            Center
          </Center>
        </ComponentCard>
        <ComponentCard name="Circle / Square">
          <HStack gap="4">
            <Circle size="10" bg="brand.solid" color="brand.contrast">
              C
            </Circle>
            <Square size="10" bg="bg.subtle" rounded="md">
              S
            </Square>
          </HStack>
        </ComponentCard>
        <ComponentCard name="Container">
          <Container maxW="md" bg="bg.muted" rounded="md" py="2">
            Container
          </Container>
        </ComponentCard>
        <ComponentCard name="Float">
          <Box pos="relative" h="16" bg="bg.subtle" rounded="md">
            <Float placement="top-end">
              <Badge colorPalette="red">New</Badge>
            </Float>
            Content
          </Box>
        </ComponentCard>
        <ComponentCard name="Flex">
          <Flex gap="2">
            <Box p="2" bg="brand.solid" color="brand.contrast" rounded="sm">
              Flex 1
            </Box>
            <Box p="2" bg="brand.solid" color="brand.contrast" rounded="sm">
              Flex 2
            </Box>
          </Flex>
        </ComponentCard>
        <ComponentCard name="Grid">
          <Grid templateColumns="repeat(3, 1fr)" gap="2">
            <Box p="2" bg="bg.subtle" rounded="sm">
              1
            </Box>
            <Box p="2" bg="bg.subtle" rounded="sm">
              2
            </Box>
            <Box p="2" bg="bg.subtle" rounded="sm">
              3
            </Box>
          </Grid>
        </ComponentCard>
        <ComponentCard name="HStack / VStack">
          <HStack gap="2">
            <Text>A</Text>
            <Text>B</Text>
          </HStack>
          <VStack gap="1" align="flex-start">
            <Text>VStack 1</Text>
            <Text>VStack 2</Text>
          </VStack>
        </ComponentCard>
        <ComponentCard name="ScrollArea">
          <ScrollArea.Root height="6rem" size="sm">
            <ScrollArea.Viewport>
              <ScrollArea.Content>
                <Text>Scrollable content. Line 1. Line 2. Line 3. Line 4. Line 5.</Text>
              </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar>
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </ComponentCard>
        <ComponentCard name="SimpleGrid">
          <SimpleGrid columns={2} gap="2">
            <Box p="2" bg="bg.subtle" rounded="sm">
              A
            </Box>
            <Box p="2" bg="bg.subtle" rounded="sm">
              B
            </Box>
          </SimpleGrid>
        </ComponentCard>
        <ComponentCard name="Spacer">
          <Flex>
            <Text>Left</Text>
            <Spacer />
            <Text>Right</Text>
          </Flex>
        </ComponentCard>
        <ComponentCard name="Stack">
          <Stack gap="2">
            <Text>Stack item 1</Text>
            <Text>Stack item 2</Text>
          </Stack>
        </ComponentCard>
        <ComponentCard name="Sticky">
          <Box h="24" overflow="auto">
            <Box h="8" />
            <Sticky top="0" bg="bg.muted" p="2" zIndex="1">
              Sticky bar
            </Sticky>
            <Box h="16" />
          </Box>
        </ComponentCard>
        <ComponentCard name="Wrap">
          <Wrap gap="2">
            <Badge>Wrap</Badge>
            <Badge>items</Badge>
            <Badge>flow</Badge>
          </Wrap>
        </ComponentCard>
        <ComponentCard name="Carousel">
          {(() => {
            const items = [1, 2, 3]
            return (
              <Carousel.Root slideCount={items.length} maxW="md">
                <Carousel.ItemGroup>
                  {items.map((_, i) => (
                    <Carousel.Item key={i} index={i}>
                      <Center w="100%" h="120px" bg="bg.subtle" rounded="lg" textStyle="2xl">
                        {i + 1}
                      </Center>
                    </Carousel.Item>
                  ))}
                </Carousel.ItemGroup>
                <Carousel.Control justifyContent="center" gap="2">
                  <Carousel.PrevTrigger asChild>
                    <IconButton size="xs" variant="ghost" aria-label="Previous">
                      <Icon name="chevron-left" />
                    </IconButton>
                  </Carousel.PrevTrigger>
                  <Carousel.Indicators />
                  <Carousel.NextTrigger asChild>
                    <IconButton size="xs" variant="ghost" aria-label="Next">
                      <Icon name="chevron-right" />
                    </IconButton>
                  </Carousel.NextTrigger>
                </Carousel.Control>
              </Carousel.Root>
            )
          })()}
        </ComponentCard>
      </ComponentSection>

      <ComponentSection title="Button &amp; Link" cardIds={NAV_SECTIONS[1].cards.map(nameToId)}>
        <ComponentCard name="Button">
          <Stack gap="3">
            <Text textStyle="sm" color="fg.muted">Variantit (brand)</Text>
            <HStack gap="2" wrap="wrap">
              <Button colorPalette="brand" variant="solid">Solid</Button>
              <Button colorPalette="brand" variant="subtle">Subtle</Button>
              <Button colorPalette="brand" variant="surface">Surface</Button>
              <Button colorPalette="brand" variant="outline">Outline</Button>
              <Button colorPalette="brand" variant="ghost">Ghost</Button>
              <Button colorPalette="brand" variant="plain">Plain</Button>
            </HStack>
          </Stack>
        </ComponentCard>
        <ComponentCard name="ButtonGroup">
          <ButtonGroup>
            <Button size="sm" colorPalette="brand">Save</Button>
            <Button size="sm" variant="outline">
              Cancel
            </Button>
          </ButtonGroup>
        </ComponentCard>
        <ComponentCard name="CloseButton">
          <CloseButton />
        </ComponentCard>
        <ComponentCard name="Link">
          <Link href="#" color="brand.solid">
            Link
          </Link>
        </ComponentCard>
      </ComponentSection>

      <ComponentSection title="Icons (GDS)" cardIds={NAV_SECTIONS[2].cards.map(nameToId)}>
        <ComponentCard name="Icon – Figma-väritokenit">
          <Stack gap="4">
            <Text textStyle="sm" color="fg.muted">
              Ikonit src/assets, väri prop käyttää Figman semanttisia tokeneita.
            </Text>
            <SimpleGrid columns={{ base: 2, md: 4 }} gap="4">
              <Stack gap="2" alignItems="center">
                <Text textStyle="xs" color="fg.muted">fg.default</Text>
                <HStack gap="2">
                  <Icon name="star" color="fg.default" size="6" />
                  <Icon name="user" color="fg.default" size="6" />
                  <Icon name="heart" color="fg.default" size="6" />
                </HStack>
              </Stack>
              <Stack gap="2" alignItems="center">
                <Text textStyle="xs" color="fg.muted">fg.muted</Text>
                <HStack gap="2">
                  <Icon name="star" color="fg.muted" size="6" />
                  <Icon name="user" color="fg.muted" size="6" />
                  <Icon name="heart" color="fg.muted" size="6" />
                </HStack>
              </Stack>
              <Stack gap="2" alignItems="center">
                <Text textStyle="xs" color="fg.muted">brand.solid</Text>
                <HStack gap="2">
                  <Icon name="star" color="brand.solid" size="6" />
                  <Icon name="user" color="brand.solid" size="6" />
                  <Icon name="heart" color="brand.solid" size="6" />
                </HStack>
              </Stack>
              <Stack gap="2" alignItems="center">
                <Text textStyle="xs" color="fg.muted">Koot (size)</Text>
                <HStack gap="2" alignItems="center">
                  <Icon name="star" color="fg.default" size="4" />
                  <Icon name="star" color="fg.default" size="5" />
                  <Icon name="star" color="fg.default" size="6" />
                  <Icon name="star" color="fg.default" size="8" />
                </HStack>
              </Stack>
            </SimpleGrid>
            <Text textStyle="xs" color="fg.muted">
              Käyttö: <Code fontSize="xs">&lt;Icon name=&quot;star&quot; color=&quot;brand.solid&quot; size=&quot;5&quot; /&gt;</Code> – import from @/components/icons
            </Text>
          </Stack>
        </ComponentCard>
      </ComponentSection>

      <ComponentSection title="Form: Input, Field, Checkbox, Switch, Select" cardIds={NAV_SECTIONS[3].cards.map(nameToId)}>
        <ComponentCard name="Checkbox">
          <Checkbox.Root colorPalette="brand">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Checkbox</Checkbox.Label>
          </Checkbox.Root>
        </ComponentCard>
        <ComponentCard name="Editable">
          <Editable.Root defaultValue="Editable text">
            <Editable.Preview />
            <Editable.Input />
          </Editable.Root>
        </ComponentCard>
        <ComponentCard name="Field">
          <Field.Root>
            <Field.Label>Field label</Field.Label>
            <Input placeholder="Field" />
            <Field.HelperText>Helper text</Field.HelperText>
          </Field.Root>
        </ComponentCard>
        <ComponentCard name="FileUpload">
          <FileUpload.Root>
            <FileUpload.HiddenInput />
            <FileUpload.Trigger asChild>
              <Button variant="outline" size="sm">
                Upload file
              </Button>
            </FileUpload.Trigger>
            <FileUpload.List />
          </FileUpload.Root>
        </ComponentCard>
        <ComponentCard name="Input">
          <Stack gap="3">
            <Text textStyle="sm" color="fg.muted">Variantit</Text>
            <Stack gap="2">
              <Input placeholder="Outline (oletus)" variant="outline" />
              <Input placeholder="Subtle" variant="subtle" />
              <Input placeholder="Flushed" variant="flushed" />
            </Stack>
          </Stack>
        </ComponentCard>
        <ComponentCard name="InputGroup">
          <InputGroup>
            <Input placeholder="With group" />
          </InputGroup>
        </ComponentCard>
        <ComponentCard name="NativeSelect">
          <NativeSelect.Root>
            <NativeSelect.Field>
              <option>Option 1</option>
              <option>Option 2</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </ComponentCard>
        <ComponentCard name="Select (collection)">
          <Select.Root
            collection={selectFrameworks}
            size="sm"
            width="320px"
            colorPalette="brand"
          >
            <Select.HiddenSelect />
            <Select.Label>Valitse framework</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Valitse framework" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {selectFrameworks.items.map((item) => (
                    <Select.Item item={item} key={item.value}>
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </ComponentCard>
        <ComponentCard name="NumberInput">
          <NumberInput.Root defaultValue="0" maxW="200px">
            <NumberInput.Control>
              <NumberInput.IncrementTrigger />
              <NumberInput.DecrementTrigger />
            </NumberInput.Control>
            <NumberInput.Input />
          </NumberInput.Root>
        </ComponentCard>
        <ComponentCard name="PinInput">
          <PinInput.Root>
            <PinInput.HiddenInput />
            <PinInput.Control>
              <PinInput.Input index={0} />
              <PinInput.Input index={1} />
              <PinInput.Input index={2} />
              <PinInput.Input index={3} />
            </PinInput.Control>
          </PinInput.Root>
        </ComponentCard>
        <ComponentCard name="RadioGroup">
          <RadioGroup.Root colorPalette="brand" defaultValue="a">
            <Stack gap="2">
              <RadioGroup.Item value="a">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemControl>
                  <RadioGroup.ItemIndicator />
                </RadioGroup.ItemControl>
                <RadioGroup.ItemText>Option A</RadioGroup.ItemText>
              </RadioGroup.Item>
              <RadioGroup.Item value="b">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemControl>
                  <RadioGroup.ItemIndicator />
                </RadioGroup.ItemControl>
                <RadioGroup.ItemText>Option B</RadioGroup.ItemText>
              </RadioGroup.Item>
            </Stack>
          </RadioGroup.Root>
        </ComponentCard>
        <ComponentCard name="Slider">
          <Slider.Root>
            <Slider.Control>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumb index={0} />
            </Slider.Control>
          </Slider.Root>
        </ComponentCard>
        <ComponentCard name="Switch">
          <Switch.Root colorPalette="brand">
            <Switch.HiddenInput />
            <Switch.Control />
            <Switch.Label>Switch</Switch.Label>
          </Switch.Root>
        </ComponentCard>
        <ComponentCard name="TagsInput">
          <TagsInput.Root defaultValue={["React", "GDS", "TypeScript"]}>
            <TagsInput.Label>Tags</TagsInput.Label>
            <TagsInput.Control>
              <TagsInput.Items />
              <TagsInput.Input placeholder="Add tag..." />
            </TagsInput.Control>
          </TagsInput.Root>
        </ComponentCard>
        <ComponentCard name="Textarea">
          <Stack gap="3">
            <Text textStyle="sm" color="fg.muted">Variantit</Text>
            <Stack gap="2">
              <Textarea placeholder="Outline (oletus)" variant="outline" rows={2} />
              <Textarea placeholder="Subtle" variant="subtle" rows={2} />
              <Textarea placeholder="Flushed" variant="flushed" rows={2} />
            </Stack>
          </Stack>
        </ComponentCard>
        <ComponentCard name="CheckboxCard">
          <CheckboxCard.Root maxW="240px">
            <CheckboxCard.HiddenInput />
            <CheckboxCard.Control>
              <CheckboxCard.Content>
                <CheckboxCard.Label>Next.js</CheckboxCard.Label>
                <CheckboxCard.Description>Best for apps</CheckboxCard.Description>
              </CheckboxCard.Content>
              <CheckboxCard.Indicator />
            </CheckboxCard.Control>
          </CheckboxCard.Root>
        </ComponentCard>
        <ComponentCard name="Fieldset">
          <Fieldset.Root size="sm" maxW="xs">
            <Fieldset.Legend>Contact</Fieldset.Legend>
            <Fieldset.Content>
              <Field.Root>
                <Field.Label>Name</Field.Label>
                <Input />
              </Field.Root>
              <Field.Root>
                <Field.Label>Email</Field.Label>
                <Input type="email" />
              </Field.Root>
            </Fieldset.Content>
          </Fieldset.Root>
        </ComponentCard>
        <ComponentCard name="RadioCard">
          <RadioCard.Root defaultValue="next" colorPalette="brand">
            <RadioCard.Label>Framework</RadioCard.Label>
            <HStack align="stretch" gap="2">
              {[
                { value: "next", title: "Next.js" },
                { value: "vite", title: "Vite" },
                { value: "astro", title: "Astro" },
              ].map((item) => (
                <RadioCard.Item key={item.value} value={item.value}>
                  <RadioCard.ItemHiddenInput />
                  <RadioCard.ItemControl>
                    <RadioCard.ItemText>{item.title}</RadioCard.ItemText>
                    <RadioCard.ItemIndicator />
                  </RadioCard.ItemControl>
                </RadioCard.Item>
              ))}
            </HStack>
          </RadioCard.Root>
        </ComponentCard>
      </ComponentSection>

      <ComponentSection title="Data display: Card, Badge, Stat, Table, List" cardIds={NAV_SECTIONS[4].cards.map(nameToId)}>
        <ComponentCard name="Avatar">
          <Stack gap="3">
            <Text textStyle="sm" color="fg.muted">Variantit + shape</Text>
            <HStack gap="4" wrap="wrap">
              <Stack align="center" gap="1">
                <Avatar.Root variant="subtle" colorPalette="brand">
                  <Avatar.Fallback name="JD" />
                </Avatar.Root>
                <Text textStyle="xs" color="fg.muted">subtle</Text>
              </Stack>
              <Stack align="center" gap="1">
                <Avatar.Root variant="solid" colorPalette="brand">
                  <Avatar.Fallback name="AB" />
                </Avatar.Root>
                <Text textStyle="xs" color="fg.muted">solid</Text>
              </Stack>
              <Stack align="center" gap="1">
                <Avatar.Root variant="outline" colorPalette="brand">
                  <Avatar.Fallback name="XY" />
                </Avatar.Root>
                <Text textStyle="xs" color="fg.muted">outline</Text>
              </Stack>
              <Stack align="center" gap="1">
                <Avatar.Root shape="rounded" variant="subtle">
                  <Avatar.Fallback name="R" />
                </Avatar.Root>
                <Text textStyle="xs" color="fg.muted">rounded</Text>
              </Stack>
              <Stack align="center" gap="1">
                <Avatar.Root shape="square" variant="subtle">
                  <Avatar.Fallback name="S" />
                </Avatar.Root>
                <Text textStyle="xs" color="fg.muted">square</Text>
              </Stack>
            </HStack>
          </Stack>
        </ComponentCard>
        <ComponentCard name="Badge">
          <Stack gap="3">
            <Text textStyle="sm" color="fg.muted">Variantit (brand)</Text>
            <HStack gap="2" wrap="wrap">
              <Badge colorPalette="brand" variant="solid">Solid</Badge>
              <Badge colorPalette="brand" variant="subtle">Subtle</Badge>
              <Badge colorPalette="brand" variant="outline">Outline</Badge>
              <Badge colorPalette="brand" variant="surface">Surface</Badge>
              <Badge colorPalette="brand" variant="plain">Plain</Badge>
            </HStack>
          </Stack>
        </ComponentCard>
        <ComponentCard name="Blockquote">
          <Blockquote.Root>
            <Blockquote.Content>Quote content</Blockquote.Content>
            <Blockquote.Caption>— Author</Blockquote.Caption>
          </Blockquote.Root>
        </ComponentCard>
        <ComponentCard name="Card">
          <Stack gap="3">
            <Text textStyle="sm" color="fg.muted">Variantit</Text>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap="4">
              <Card.Root maxW="xs" variant="outline">
                <Card.Header>
                  <Card.Title>Outline</Card.Title>
                </Card.Header>
                <Card.Body><Text textStyle="sm">Card body</Text></Card.Body>
              </Card.Root>
              <Card.Root maxW="xs" variant="subtle">
                <Card.Header>
                  <Card.Title>Subtle</Card.Title>
                </Card.Header>
                <Card.Body><Text textStyle="sm">Card body</Text></Card.Body>
              </Card.Root>
              <Card.Root maxW="xs" variant="elevated">
                <Card.Header>
                  <Card.Title>Elevated</Card.Title>
                </Card.Header>
                <Card.Body><Text textStyle="sm">Card body</Text></Card.Body>
              </Card.Root>
            </SimpleGrid>
          </Stack>
        </ComponentCard>
        <ComponentCard name="Code">
          <Code>code</Code>
        </ComponentCard>
        <ComponentCard name="Highlight">
          <Text>
            <Highlight query="highlight" styles={{ bg: "yellow.subtle" }}>
              Text with highlight
            </Highlight>
          </Text>
        </ComponentCard>
        <ComponentCard name="Image">
          <Image
            src="https://picsum.photos/100/60"
            alt="Sample"
            w="100px"
            h="60px"
            objectFit="cover"
            rounded="md"
          />
        </ComponentCard>
        <ComponentCard name="Kbd">
          <Kbd>⌘K</Kbd>
        </ComponentCard>
        <ComponentCard name="List">
          <List.Root>
            <List.Item>Item 1</List.Item>
            <List.Item>Item 2</List.Item>
          </List.Root>
        </ComponentCard>
        <ComponentCard name="Stat">
          <Stat.Root>
            <Stat.Label>Stat label</Stat.Label>
            <Stat.ValueText>123</Stat.ValueText>
            <Stat.HelpText>Help text</Stat.HelpText>
          </Stat.Root>
        </ComponentCard>
        <ComponentCard name="Status">
          <Stack gap="3">
            <Text textStyle="sm" color="fg.muted">Väripalettit (status)</Text>
            <HStack gap="2" wrap="wrap">
              <Status.Root colorPalette="green" size="sm">Success</Status.Root>
              <Status.Root colorPalette="red" size="sm">Error</Status.Root>
              <Status.Root colorPalette="yellow" size="sm">Warning</Status.Root>
              <Status.Root colorPalette="blue" size="sm">Info</Status.Root>
              <Status.Root colorPalette="gray" size="sm">Neutral</Status.Root>
            </HStack>
          </Stack>
        </ComponentCard>
        <ComponentCard name="Table">
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Col 1</Table.ColumnHeader>
                <Table.ColumnHeader>Col 2</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>A</Table.Cell>
                <Table.Cell>B</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </ComponentCard>
        <ComponentCard name="Tag">
          <Stack gap="3">
            <Text textStyle="sm" color="fg.muted">Variantit (brand)</Text>
            <HStack gap="2" wrap="wrap">
              <Tag.Root colorPalette="brand" variant="subtle">Subtle</Tag.Root>
              <Tag.Root colorPalette="brand" variant="solid">Solid</Tag.Root>
              <Tag.Root colorPalette="brand" variant="outline">Outline</Tag.Root>
              <Tag.Root colorPalette="brand" variant="surface">Surface</Tag.Root>
            </HStack>
          </Stack>
        </ComponentCard>
      </ComponentSection>

      <ComponentSection title="Feedback: Alert, Progress, Spinner, Skeleton" cardIds={NAV_SECTIONS[5].cards.map(nameToId)}>
        <ComponentCard name="Alert">
          <Stack gap="3">
            <Text textStyle="sm" color="fg.muted">Status + variantit</Text>
            <Stack gap="2">
              <Alert.Root status="success" variant="subtle">
                <Alert.Indicator />
                <Alert.Title>Success (subtle)</Alert.Title>
              </Alert.Root>
              <Alert.Root status="error" variant="subtle">
                <Alert.Indicator />
                <Alert.Title>Error (subtle)</Alert.Title>
              </Alert.Root>
              <Alert.Root status="warning" variant="subtle">
                <Alert.Indicator />
                <Alert.Title>Warning (subtle)</Alert.Title>
              </Alert.Root>
              <Alert.Root status="info" variant="solid">
                <Alert.Indicator />
                <Alert.Title>Info (solid)</Alert.Title>
              </Alert.Root>
            </Stack>
          </Stack>
        </ComponentCard>
        <ComponentCard name="EmptyState">
          <EmptyState.Root>
            <EmptyState.Content>
              <EmptyState.Indicator />
              <EmptyState.Title>Empty</EmptyState.Title>
              <EmptyState.Description>No items</EmptyState.Description>
            </EmptyState.Content>
          </EmptyState.Root>
        </ComponentCard>
        <ComponentCard name="Loader">
          <Loader text="Loading...">
            <Button size="sm">Click me</Button>
          </Loader>
        </ComponentCard>
        <ComponentCard name="QrCode">
          <QrCode.Root value="https://chakra-ui.com" size="sm">
            <QrCode.Frame>
              <QrCode.Pattern />
            </QrCode.Frame>
          </QrCode.Root>
        </ComponentCard>
        <ComponentCard name="Timeline">
          <Timeline.Root maxW="280px" size="sm">
            <Timeline.Item>
              <Timeline.Connector>
                <Timeline.Separator />
                <Timeline.Indicator>1</Timeline.Indicator>
              </Timeline.Connector>
              <Timeline.Content>
                <Timeline.Title>First step</Timeline.Title>
                <Timeline.Description>Done</Timeline.Description>
              </Timeline.Content>
            </Timeline.Item>
            <Timeline.Item>
              <Timeline.Connector>
                <Timeline.Separator />
                <Timeline.Indicator>2</Timeline.Indicator>
              </Timeline.Connector>
              <Timeline.Content>
                <Timeline.Title>Second step</Timeline.Title>
              </Timeline.Content>
            </Timeline.Item>
          </Timeline.Root>
        </ComponentCard>
        <ComponentCard name="Progress">
          <Progress.Root value={60} colorPalette="brand">
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>
        </ComponentCard>
        <ComponentCard name="ProgressCircle">
          <ProgressCircle.Root value={70} colorPalette="brand">
            <ProgressCircle.Circle>
              <ProgressCircle.Track />
              <ProgressCircle.Range />
            </ProgressCircle.Circle>
            <ProgressCircle.ValueText />
          </ProgressCircle.Root>
        </ComponentCard>
        <ComponentCard name="Skeleton">
          <Skeleton h="6" w="32" rounded="md" />
        </ComponentCard>
        <ComponentCard name="Spinner">
          <Spinner size="md" colorPalette="brand" />
        </ComponentCard>
      </ComponentSection>

      <ComponentSection title="Overlay: Dialog, Drawer, Popover, Menu" cardIds={NAV_SECTIONS[6].cards.map(nameToId)}>
        <ComponentCard name="Dialog">
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button variant="outline">Open Dialog</Button>
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Dialog</Dialog.Title>
                  <Dialog.CloseTrigger />
                </Dialog.Header>
                <Dialog.Body>Body</Dialog.Body>
                <Dialog.Footer>
                  <Button colorPalette="brand">OK</Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Root>
        </ComponentCard>
        <ComponentCard name="Drawer">
          <Drawer.Root>
            <Drawer.Trigger asChild>
              <Button variant="outline">Open Drawer</Button>
            </Drawer.Trigger>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content>
                <Drawer.Header>
                  <Drawer.Title>Drawer</Drawer.Title>
                  <Drawer.CloseTrigger />
                </Drawer.Header>
                <Drawer.Body>Body</Drawer.Body>
              </Drawer.Content>
            </Drawer.Positioner>
          </Drawer.Root>
        </ComponentCard>
        <ComponentCard name="HoverCard">
          <HoverCard.Root>
            <HoverCard.Trigger asChild>
              <Link href="#">Hover me</Link>
            </HoverCard.Trigger>
            <HoverCard.Positioner>
              <HoverCard.Content>
                <HoverCard.Arrow />
                <Text>HoverCard content</Text>
              </HoverCard.Content>
            </HoverCard.Positioner>
          </HoverCard.Root>
        </ComponentCard>
        <ComponentCard name="Menu">
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant="outline">Menu</Button>
            </Menu.Trigger>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="1">Item 1</Menu.Item>
                <Menu.Item value="2">Item 2</Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
        </ComponentCard>
        <ComponentCard name="Popover">
          <Popover.Root>
            <Popover.Trigger asChild>
              <Button variant="outline">Popover</Button>
            </Popover.Trigger>
            <Popover.Positioner>
              <Popover.Content>
                <Popover.Header>
                  <Popover.Title>Popover</Popover.Title>
                  <Popover.CloseTrigger />
                </Popover.Header>
                <Popover.Body>Content</Popover.Body>
              </Popover.Content>
            </Popover.Positioner>
          </Popover.Root>
        </ComponentCard>
        <ComponentCard name="Toggle">
          <Toggle.Root asChild colorPalette="brand">
            <Button variant={{ base: "subtle", _pressed: "solid" }}>
              Toggle
            </Button>
          </Toggle.Root>
        </ComponentCard>
        <ComponentCard name="Tooltip">
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Button size="sm">Hover</Button>
            </Tooltip.Trigger>
            <Tooltip.Positioner>
              <Tooltip.Content>Tooltip text</Tooltip.Content>
            </Tooltip.Positioner>
          </Tooltip.Root>
        </ComponentCard>
      </ComponentSection>

      <ComponentSection title="Navigation: Tabs, Accordion, Breadcrumb" cardIds={NAV_SECTIONS[7].cards.map(nameToId)}>
        <ComponentCard name="Accordion">
          <Accordion.Root colorPalette="brand">
            <Accordion.Item value="1">
              <Accordion.ItemTrigger>Item 1</Accordion.ItemTrigger>
              <Accordion.ItemContent>Content 1</Accordion.ItemContent>
            </Accordion.Item>
            <Accordion.Item value="2">
              <Accordion.ItemTrigger>Item 2</Accordion.ItemTrigger>
              <Accordion.ItemContent>Content 2</Accordion.ItemContent>
            </Accordion.Item>
          </Accordion.Root>
        </ComponentCard>
        <ComponentCard name="Breadcrumb">
          <Breadcrumb.Root>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Link href="#">Page</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.CurrentLink>Current</Breadcrumb.CurrentLink>
            </Breadcrumb.List>
          </Breadcrumb.Root>
        </ComponentCard>
        <ComponentCard name="Pagination">
          <Pagination.Root count={20} pageSize={5} defaultPage={1} colorPalette="brand">
            <ButtonGroup variant="ghost" size="sm">
              <Pagination.PrevTrigger asChild>
                <IconButton aria-label="Previous">←</IconButton>
              </Pagination.PrevTrigger>
              <Pagination.Items
                render={(page) => (
                  <IconButton
                    variant={{ base: "ghost", _selected: "solid" }}
                    key={page.value}
                  >
                    {page.value}
                  </IconButton>
                )}
              />
              <Pagination.NextTrigger asChild>
                <IconButton aria-label="Next">→</IconButton>
              </Pagination.NextTrigger>
            </ButtonGroup>
          </Pagination.Root>
        </ComponentCard>
        <ComponentCard name="Steps">
          <Steps.Root defaultStep={0} count={3} colorPalette="brand">
            <Steps.List>
              <Steps.Item index={0} title="Step 1">
                <Steps.Indicator />
                <Steps.Title>Step 1</Steps.Title>
                <Steps.Separator />
              </Steps.Item>
              <Steps.Item index={1} title="Step 2">
                <Steps.Indicator />
                <Steps.Title>Step 2</Steps.Title>
                <Steps.Separator />
              </Steps.Item>
              <Steps.Item index={2} title="Step 3">
                <Steps.Indicator />
                <Steps.Title>Step 3</Steps.Title>
                <Steps.Separator />
              </Steps.Item>
            </Steps.List>
            <Steps.Content index={0}>Content 1</Steps.Content>
            <Steps.Content index={1}>Content 2</Steps.Content>
            <Steps.Content index={2}>Content 3</Steps.Content>
            <ButtonGroup size="sm" variant="outline" mt="2">
              <Steps.PrevTrigger asChild>
                <Button variant="outline">Prev</Button>
              </Steps.PrevTrigger>
              <Steps.NextTrigger asChild>
                <Button colorPalette="brand">Next</Button>
              </Steps.NextTrigger>
            </ButtonGroup>
          </Steps.Root>
        </ComponentCard>
        <ComponentCard name="Tabs">
          <Stack gap="4">
            <Text textStyle="sm" color="fg.muted">Variantit (brand)</Text>
            <Stack gap="3">
              <Box>
                <Text textStyle="xs" color="fg.muted" mb="1">line</Text>
                <Tabs.Root defaultValue="a" colorPalette="brand" variant="line">
                  <Tabs.List>
                    <Tabs.Trigger value="a">Tab A</Tabs.Trigger>
                    <Tabs.Trigger value="b">Tab B</Tabs.Trigger>
                  </Tabs.List>
                  <Tabs.Content value="a">Content A</Tabs.Content>
                  <Tabs.Content value="b">Content B</Tabs.Content>
                </Tabs.Root>
              </Box>
              <Box>
                <Text textStyle="xs" color="fg.muted" mb="1">subtle</Text>
                <Tabs.Root defaultValue="a" colorPalette="brand" variant="subtle">
                  <Tabs.List>
                    <Tabs.Trigger value="a">Tab A</Tabs.Trigger>
                    <Tabs.Trigger value="b">Tab B</Tabs.Trigger>
                  </Tabs.List>
                  <Tabs.Content value="a">Content A</Tabs.Content>
                  <Tabs.Content value="b">Content B</Tabs.Content>
                </Tabs.Root>
              </Box>
              <Box>
                <Text textStyle="xs" color="fg.muted" mb="1">enclosed</Text>
                <Tabs.Root defaultValue="a" colorPalette="brand" variant="enclosed">
                  <Tabs.List>
                    <Tabs.Trigger value="a">Tab A</Tabs.Trigger>
                    <Tabs.Trigger value="b">Tab B</Tabs.Trigger>
                  </Tabs.List>
                  <Tabs.Content value="a">Content A</Tabs.Content>
                  <Tabs.Content value="b">Content B</Tabs.Content>
                </Tabs.Root>
              </Box>
              <Box>
                <Text textStyle="xs" color="fg.muted" mb="1">outline</Text>
                <Tabs.Root defaultValue="a" colorPalette="brand" variant="outline">
                  <Tabs.List>
                    <Tabs.Trigger value="a">Tab A</Tabs.Trigger>
                    <Tabs.Trigger value="b">Tab B</Tabs.Trigger>
                  </Tabs.List>
                  <Tabs.Content value="a">Content A</Tabs.Content>
                  <Tabs.Content value="b">Content B</Tabs.Content>
                </Tabs.Root>
              </Box>
              <Box>
                <Text textStyle="xs" color="fg.muted" mb="1">plain</Text>
                <Tabs.Root defaultValue="a" colorPalette="brand" variant="plain">
                  <Tabs.List>
                    <Tabs.Trigger value="a">Tab A</Tabs.Trigger>
                    <Tabs.Trigger value="b">Tab B</Tabs.Trigger>
                  </Tabs.List>
                  <Tabs.Content value="a">Content A</Tabs.Content>
                  <Tabs.Content value="b">Content B</Tabs.Content>
                </Tabs.Root>
              </Box>
            </Stack>
          </Stack>
        </ComponentCard>
      </ComponentSection>

      <ComponentSection title="Misc: Group, Separator, Collapsible, Clipboard" cardIds={NAV_SECTIONS[8].cards.map(nameToId)}>
        <ComponentCard name="ActionBar">
          <ActionBar.Root>
            <ActionBar.Positioner>
              <ActionBar.Content>
                <Button size="sm" colorPalette="brand">Action</Button>
              </ActionBar.Content>
            </ActionBar.Positioner>
          </ActionBar.Root>
        </ComponentCard>
        <ComponentCard name="Collapsible">
          <Collapsible.Root>
            <Collapsible.Trigger asChild>
              <Button size="sm" variant="ghost">
                Toggle
              </Button>
            </Collapsible.Trigger>
            <Collapsible.Content>Collapsible content</Collapsible.Content>
          </Collapsible.Root>
        </ComponentCard>
        <ComponentCard name="Group">
          <Group attached>
            <Button size="sm" colorPalette="brand">A</Button>
            <Button size="sm" variant="outline">
              B
            </Button>
          </Group>
        </ComponentCard>
        <ComponentCard name="Separator">
          <VStack w="full" gap="2">
            <Text>Above</Text>
            <Separator />
            <Text>Below</Text>
          </VStack>
        </ComponentCard>
        <ComponentCard name="Clipboard">
          <Clipboard.Root value="https://chakra-ui.com">
            <Clipboard.Trigger asChild>
              <Button size="sm" variant="surface">
                <Clipboard.Indicator />
                Copy link
              </Button>
            </Clipboard.Trigger>
          </Clipboard.Root>
        </ComponentCard>
      </ComponentSection>

      <ComponentSection title="Typography: Heading, Text" cardIds={NAV_SECTIONS[9].cards.map(nameToId)}>
        <ComponentCard name="Heading">
          <Heading size="md">Heading</Heading>
        </ComponentCard>
        <ComponentCard name="Strong">
          <Text><Strong>Strong</Strong> text</Text>
        </ComponentCard>
        <ComponentCard name="Text">
          <Text>Text with textStyle</Text>
        </ComponentCard>
      </ComponentSection>

      <ComponentSection title="More: SegmentGroup, RatingGroup, ColorPicker, TreeView, Show, DatePicker, Combobox, Listbox, CodeBlock, Marquee, Prose, Toast, SkipNav, Overlay, DownloadTrigger, Charts" cardIds={NAV_SECTIONS[10].cards.map(nameToId)}>
        <ComponentCard name="ColorPicker">
          <ColorPicker.Root>
            <ColorPicker.Control>
              <ColorPicker.Trigger />
              <ColorPicker.ValueText />
            </ColorPicker.Control>
            <ColorPicker.Positioner>
              <ColorPicker.Content>
                <ColorPicker.Area>
                  <ColorPicker.AreaBackground />
                  <ColorPicker.AreaThumb />
                </ColorPicker.Area>
              </ColorPicker.Content>
            </ColorPicker.Positioner>
          </ColorPicker.Root>
        </ComponentCard>
        <ComponentCard name="ColorSwatch">
          <ColorSwatch value="#3b82f6" />
        </ComponentCard>
        <ComponentCard name="RatingGroup">
          <RatingGroup.Root count={5} defaultValue={3} colorPalette="brand">
            <RatingGroup.Control>
              <For each={[1, 2, 3, 4, 5]}>
                {(index) => (
                  <RatingGroup.Item key={index} index={index}>
                    <RatingGroup.ItemIndicator />
                  </RatingGroup.Item>
                )}
              </For>
            </RatingGroup.Control>
          </RatingGroup.Root>
        </ComponentCard>
        <ComponentCard name="SegmentGroup">
          <SegmentGroup.Root colorPalette="brand">
            <SegmentGroup.Indicator />
            <SegmentGroup.Item value="one">One</SegmentGroup.Item>
            <SegmentGroup.Item value="two">Two</SegmentGroup.Item>
            <SegmentGroup.Item value="three">Three</SegmentGroup.Item>
          </SegmentGroup.Root>
        </ComponentCard>
        <ComponentCard name="Show (conditional)">
          <Text>Show-komponentti: ehdollinen renderöinti.</Text>
        </ComponentCard>
        <ComponentCard name="Splitter">
          <Text textStyle="sm" color="fg.muted">
            Splitter: vaatii panels-arrayin (PanelData). Katso komponenttidokumentaatio.
          </Text>
        </ComponentCard>
        <ComponentCard name="TreeView">
          <TreeView.Root collection={treeCollection} maxW="sm" colorPalette="brand">
            <TreeView.Label>Puurakenne</TreeView.Label>
            <TreeView.Tree>
              <TreeView.Node
                indentGuide={<TreeView.BranchIndentGuide />}
                render={({ node, nodeState }) =>
                  nodeState.isBranch ? (
                    <TreeView.BranchControl>
                      <Icon name="folder" color="fg.muted" size="4" />
                      <TreeView.BranchText>{node.name}</TreeView.BranchText>
                    </TreeView.BranchControl>
                  ) : (
                    <TreeView.Item>
                      <Icon name="file" color="fg.muted" size="4" />
                      <TreeView.ItemText>{node.name}</TreeView.ItemText>
                    </TreeView.Item>
                  )
                }
              />
            </TreeView.Tree>
          </TreeView.Root>
        </ComponentCard>
        <ComponentCard name="DatePicker">
          <Stack gap="2">
            <Text textStyle="sm" color="fg.muted">
              DatePicker on dokumentoitu{" "}
              <Link
                href="https://www.chakra-ui.com/docs/components/date-picker"
                target="_blank"
                rel="noopener noreferrer"
                color="brand.solid"
              >
                komponenttidokumentaatiossa
              </Link>
              . Tässä GDS-versiossa sitä ei vielä exportata.
              Kun uusi versio sisältää DatePickerin, käytä:{" "}
              <Code fontSize="xs">import {"{ DatePicker, Portal, parseDate }"} from &quot;@chakra-ui/react&quot;</Code>{" "}
              ja rakenne Root → Label, Control (Input, IndicatorGroup, Trigger LuCalendar) → Portal
              → Positioner → Content → View (day/month/year) + Header + DayTable/MonthTable/YearTable.
            </Text>
          </Stack>
        </ComponentCard>
        <ComponentCard name="Combobox">
          <ComboboxExample />
        </ComponentCard>
        <ComponentCard name="Listbox">
          <Text textStyle="sm" color="fg.muted">
            Listbox: listavalinta. Katso komponenttidokumentaatio.
          </Text>
        </ComponentCard>
        <ComponentCard name="CodeBlock">
          <Text textStyle="sm" color="fg.muted">
            CodeBlock: koodiesimerkkiblokki syntaksikorostuksella.
          </Text>
        </ComponentCard>
        <ComponentCard name="Marquee">
          <Text textStyle="sm" color="fg.muted">
            Marquee: liukuva teksti / banner.
          </Text>
        </ComponentCard>
        <ComponentCard name="Prose">
          <Text textStyle="sm" color="fg.muted">
            Prose: pitkän tekstin typografia (artikkelit, blogit).
          </Text>
        </ComponentCard>
        <ComponentCard name="Toast / Toaster">
          <Stack gap="2">
            <Text textStyle="sm" color="fg.muted">
              Toaster on lisätty Provideriin. Paina nappia näyttääksesi toastin.
            </Text>
            <HStack gap="2" flexWrap="wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  toaster.create({
                    title: "Ilmoitus",
                    description: "Tiedosto tallennettu.",
                    type: "success",
                  })
                }
              >
                Success
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  toaster.create({
                    title: "Virhe",
                    description: "Jotain meni pieleen.",
                    type: "error",
                  })
                }
              >
                Error
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  toaster.create({
                    description: "Vain kuvaus, ei otsikkoa.",
                    type: "info",
                    closable: true,
                  })
                }
              >
                Info (closable)
              </Button>
            </HStack>
          </Stack>
        </ComponentCard>
        <ComponentCard name="SkipNav">
          <Text textStyle="sm" color="fg.muted">
            SkipNav: linkki ohittaa pääsisällön (a11y).
          </Text>
        </ComponentCard>
        <ComponentCard name="Overlay">
          <Text textStyle="sm" color="fg.muted">
            Overlay: peitelayer (modaaleille, loadereille).
          </Text>
        </ComponentCard>
        <ComponentCard name="DownloadTrigger">
          <Text textStyle="sm" color="fg.muted">
            DownloadTrigger: tiedoston lataus (esim. QR-koodi).
          </Text>
        </ComponentCard>
        <ComponentCard name="Charts (AreaChart, BarChart, …)">
          <Text textStyle="sm" color="fg.muted">
            Chartit: AreaChart, BarChart, LineChart, PieChart, DonutChart, Sparkline jne. Katso komponenttidokumentaatio.
          </Text>
        </ComponentCard>
        <ComponentCard name="VisuallyHidden">
          <VisuallyHidden>Only for screen readers</VisuallyHidden>
          <Text>Visible text</Text>
        </ComponentCard>
      </ComponentSection>

      {!routeId && (
        <Text color="fg.muted" textStyle="sm" mt="8">
          Kaikki GDS-komponentit esittelyssä. Collection- tai provider-pohjaiset
          (Select, TreeView, Combobox, DatePicker, Toast) vaativat lisäasetusta – katso komponenttidokumentaatio.
        </Text>
      )}
        </Box>
      </Box>
    </Flex>
    </ShowcaseContext.Provider>
  )
}
